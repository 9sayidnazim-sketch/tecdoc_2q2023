import { PrismaClient, FitmentConfidence, PartNumberType, MarketSpec } from "@prisma/client";
import { normalizePartNumber } from "../normalize";
import type { IngestPart } from "./types";

export interface MergeStats {
  partsProcessed: number;
  partsCreated: number;
  partsUpdated: number;
  numbersLinked: number;
  crossesLinked: number;
  fitmentsCreated: number;
  fitmentsVerified: number;
  imagesStored: number;
  pricesRecorded: number;
  sourceRecordsLogged: number;
}

export function calculateSellPrice(cost: number, marginRule: string = "MARGIN_25_PLUS_VAT_5"): number {
  let markupMultiplier = 1.25;
  const vatMultiplier = 1.05; // UAE Federal Decree-Law No. (8) of 2017: 5% Standard VAT

  if (marginRule.includes("20")) {
    markupMultiplier = 1.20;
  } else if (marginRule.includes("30")) {
    markupMultiplier = 1.30;
  } else if (marginRule.includes("15")) {
    markupMultiplier = 1.15;
  }

  const rawSellPrice = cost * markupMultiplier * vatMultiplier;
  return Math.round(rawSellPrice * 100) / 100;
}

export async function mergePartIntoDatabase(
  prisma: PrismaClient,
  ingest: IngestPart
): Promise<{ partId: number; isNew: boolean }> {
  // 1. Audit log raw payload into SourceRecord
  await prisma.sourceRecord.create({
    data: {
      sourceName: ingest.sourceName,
      entityType: "part",
      rawJson: ingest.rawSourceData || { name: ingest.name, numbers: ingest.numbers },
    },
  });

  // 2. Collect all normalized numbers for this part (both main part numbers and OE numbers)
  const normalizedCandidateNumbers = new Set<string>();
  for (const n of ingest.numbers) {
    const norm = normalizePartNumber(n.numberRaw);
    if (norm) normalizedCandidateNumbers.add(norm);
  }
  if (ingest.crossReferences) {
    for (const cr of ingest.crossReferences) {
      const norm = normalizePartNumber(cr.targetNumberRaw);
      if (norm) normalizedCandidateNumbers.add(norm);
    }
  }

  // 3. Find if any existing Part in the DB already owns or is linked to any of these numbers
  let targetPartId: number | null = null;

  if (normalizedCandidateNumbers.size > 0) {
    const existingNumberHit = await prisma.partNumber.findFirst({
      where: {
        numberNormalized: { in: Array.from(normalizedCandidateNumbers) },
      },
      select: { partId: true },
    });
    if (existingNumberHit) {
      targetPartId = existingNumberHit.partId;
    }
  }

  // Ensure Brand exists
  const brandSlug = ingest.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const brand = await prisma.brand.upsert({
    where: { name: ingest.brandName },
    update: { country: ingest.brandCountry || undefined },
    create: {
      name: ingest.brandName,
      slug: `${brandSlug}-${Date.now() % 10000}`,
      country: ingest.brandCountry || "DE",
    },
  });

  // Ensure AssemblyGroup & ProductGroup exist
  let assemblyGroupId: number | undefined;
  if (ingest.assemblyGroupName) {
    const ag = await prisma.assemblyGroup.upsert({
      where: { name: ingest.assemblyGroupName },
      update: { nameAr: ingest.assemblyGroupNameAr || undefined },
      create: { name: ingest.assemblyGroupName, nameAr: ingest.assemblyGroupNameAr },
    });
    assemblyGroupId = ag.id;
  }

  let productGroupId: number | undefined;
  if (ingest.productGroupName) {
    const pg = await prisma.productGroup.upsert({
      where: { name: ingest.productGroupName },
      update: {
        nameAr: ingest.productGroupNameAr || undefined,
        assemblyGroupId: assemblyGroupId || undefined,
      },
      create: {
        name: ingest.productGroupName,
        nameAr: ingest.productGroupNameAr,
        assemblyGroupId,
      },
    });
    productGroupId = pg.id;
  }

  let partId: number;
  let isNew = false;

  if (targetPartId) {
    // Existing part found via normalized number match! Update / enrich specs
    partId = targetPartId;
    const existing = await prisma.part.findUnique({
      where: { id: partId },
      select: { specs: true, description: true, nameAr: true },
    });
    const mergedSpecs = {
      ...(typeof existing?.specs === "object" && existing.specs ? (existing.specs as object) : {}),
      ...(ingest.specs || {}),
    };
    await prisma.part.update({
      where: { id: partId },
      data: {
        specs: mergedSpecs,
        nameAr: existing?.nameAr || ingest.nameAr || undefined,
        description: existing?.description || ingest.description || undefined,
        productGroupId: productGroupId || undefined,
        assemblyGroupId: assemblyGroupId || undefined,
      },
    });
  } else {
    // Create new canonical part
    isNew = true;
    const createdPart = await prisma.part.create({
      data: {
        brandId: brand.id,
        name: ingest.name,
        nameAr: ingest.nameAr,
        description: ingest.description,
        specs: ingest.specs || {},
        assemblyGroupId,
        productGroupId,
      },
    });
    partId = createdPart.id;
  }

  // 4. Upsert Part Numbers
  for (const num of ingest.numbers) {
    const norm = normalizePartNumber(num.numberRaw);
    if (!norm) continue;

    const numType = num.type as PartNumberType;
    await prisma.partNumber.upsert({
      where: {
        partId_numberNormalized_type_brandName: {
          partId,
          numberNormalized: norm,
          type: numType,
          brandName: num.brandName || ingest.brandName,
        },
      },
      update: {
        isPrimary: Boolean(num.isPrimary),
        source: ingest.sourceName,
      },
      create: {
        partId,
        numberRaw: num.numberRaw,
        numberNormalized: norm,
        type: numType,
        brandName: num.brandName || ingest.brandName,
        source: ingest.sourceName,
        isPrimary: Boolean(num.isPrimary),
      },
    });
  }

  // 5. Upsert Cross References
  if (ingest.crossReferences) {
    for (const cr of ingest.crossReferences) {
      const norm = normalizePartNumber(cr.targetNumberRaw);
      if (!norm) continue;

      // Check if target number maps to another canonical part in DB
      const targetHit = await prisma.partNumber.findFirst({
        where: { numberNormalized: norm },
        select: { partId: true },
      });

      const existingCr = await prisma.crossReference.findFirst({
        where: {
          partId,
          targetNumberNorm: norm,
          brandName: cr.brandName,
        },
      });

      if (!existingCr) {
        await prisma.crossReference.create({
          data: {
            partId,
            targetPartId: targetHit?.partId || null,
            targetNumberRaw: cr.targetNumberRaw,
            targetNumberNorm: norm,
            brandName: cr.brandName,
            type: cr.type || "EQUIVALENT",
            source: cr.source || ingest.sourceName,
          },
        });
      }
    }
  }

  // 6. Upsert Images
  if (ingest.images) {
    for (const img of ingest.images) {
      const existingImg = await prisma.partImage.findFirst({
        where: { partId, url: img.url },
      });
      if (!existingImg) {
        await prisma.partImage.create({
          data: {
            partId,
            url: img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            isPrimary: Boolean(img.isPrimary),
            source: img.source || ingest.sourceName,
            altText: img.altText || `${ingest.name} image`,
            sortOrder: img.sortOrder || 0,
          },
        });
      }
    }
  }

  // 7. Upsert Prices (UAE Market in AED with Server-side Margin & 5% VAT)
  if (ingest.prices) {
    for (const pr of ingest.prices) {
      const sellPriceAed = calculateSellPrice(pr.cost, pr.marginRule);
      const existingPrice = await prisma.partPrice.findFirst({
        where: { partId, supplier: pr.supplier },
      });

      if (existingPrice) {
        await prisma.partPrice.update({
          where: { id: existingPrice.id },
          data: {
            cost: pr.cost,
            currency: pr.currency,
            marginRule: pr.marginRule,
            sellPriceAed,
            stockStatus: pr.stockStatus,
            stockQuantity: pr.stockQuantity,
          },
        });
      } else {
        await prisma.partPrice.create({
          data: {
            partId,
            supplier: pr.supplier,
            cost: pr.cost,
            currency: pr.currency,
            marginRule: pr.marginRule,
            sellPriceAed,
            stockStatus: pr.stockStatus,
            stockQuantity: pr.stockQuantity,
          },
        });
      }
    }
  }

  // 8. Upsert Fitment (Multi-source confidence calculation)
  if (ingest.fitments) {
    for (const fit of ingest.fitments) {
      // Find or create Vehicle
      const extId = fit.vehicle.externalVehicleId || `${fit.vehicle.make}-${fit.vehicle.model}-${fit.vehicle.generation || ''}-${fit.vehicle.yearFrom || 2020}`.toLowerCase().replace(/[^a-z0-9]/g, "-");

      let vehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [
            { externalVehicleId: extId },
            {
              make: fit.vehicle.make,
              model: fit.vehicle.model,
              yearFrom: fit.vehicle.yearFrom || null,
            },
          ],
        },
      });

      if (!vehicle) {
        vehicle = await prisma.vehicle.create({
          data: {
            make: fit.vehicle.make,
            model: fit.vehicle.model,
            generation: fit.vehicle.generation,
            yearFrom: fit.vehicle.yearFrom,
            yearTo: fit.vehicle.yearTo,
            engine: fit.vehicle.engine,
            fuel: fit.vehicle.fuel || "Petrol",
            body: fit.vehicle.body || "SUV",
            marketSpec: (fit.vehicle.marketSpec as MarketSpec) || MarketSpec.GCC,
            externalVehicleId: extId,
          },
        });
      }

      // Check existing fitment
      const existingFitment = await prisma.fitment.findUnique({
        where: {
          partId_vehicleId: {
            partId,
            vehicleId: vehicle.id,
          },
        },
      });

      if (existingFitment) {
        const currentSources: string[] = Array.isArray(existingFitment.sources)
          ? (existingFitment.sources as string[])
          : [];
        if (!currentSources.includes(ingest.sourceName)) {
          currentSources.push(ingest.sourceName);
        }
        // RULE: 2 or more sources agree -> VERIFIED, 1 source -> SINGLE
        const confidence: FitmentConfidence = currentSources.length >= 2 ? FitmentConfidence.VERIFIED : FitmentConfidence.SINGLE;

        await prisma.fitment.update({
          where: { id: existingFitment.id },
          data: {
            sources: currentSources,
            confidence,
            notes: fit.notes || existingFitment.notes,
          },
        });
      } else {
        await prisma.fitment.create({
          data: {
            partId,
            vehicleId: vehicle.id,
            sources: [ingest.sourceName],
            confidence: FitmentConfidence.SINGLE,
            notes: fit.notes,
          },
        });
      }
    }
  }

  return { partId, isNew };
}
