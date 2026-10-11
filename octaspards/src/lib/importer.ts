import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { normalizePartNumber, slugify } from "./normalize";

/* ------------------------------------------------------------------ */
/* Dataset format (natural keys - no database ids needed)              */
/* ------------------------------------------------------------------ */

const str = z.string().trim().min(1);
const optStr = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v ? v : null));
const optInt = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v, ctx) => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isInteger(n)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Expected an integer, got "${v}"` });
      return z.NEVER;
    }
    return n;
  });

export const rowSchemas = {
  vehicles: z.object({
    make: str,
    model: str,
    generation: optStr,
    yearFrom: optInt,
    yearTo: optInt,
    engine: optStr,
    fuel: optStr,
    body: optStr,
    marketSpec: optStr,
  }),
  brands: z.object({ name: str, country: optStr }),
  assemblyGroups: z.object({ name: str, nameAr: optStr }),
  productGroups: z.object({ name: str, nameAr: optStr, assemblyGroup: optStr }),
  parts: z.object({
    brand: str,
    partNumber: str,
    name: str,
    nameAr: optStr,
    description: optStr,
    productGroup: optStr,
    assemblyGroup: optStr,
    specs: z.any().optional().nullable(),
  }),
  oeNumbers: z.object({
    brand: str,
    partNumber: str,
    oeManufacturer: str,
    oeNumber: str,
  }),
  crossReferences: z.object({
    brand: str,
    partNumber: str,
    targetBrand: str,
    targetNumber: str,
    type: optStr,
  }),
  fitments: z.object({
    brand: str,
    partNumber: str,
    make: str,
    model: str,
    yearFrom: optInt,
    notes: optStr,
  }),
};

export const sections = [
  "vehicles",
  "brands",
  "assemblyGroups",
  "productGroups",
  "parts",
  "oeNumbers",
  "crossReferences",
  "fitments",
] as const;

export type Section = (typeof sections)[number];
export type Dataset = { [S in Section]?: unknown[] };

export interface ImportStats {
  created: Record<Section, number>;
  errors: string[];
}

export async function importDataset(
  prisma: PrismaClient,
  dataset: Dataset,
  _log: (msg: string) => void = () => undefined
): Promise<ImportStats> {
  const stats: ImportStats = {
    created: Object.fromEntries(sections.map((s) => [s, 0])) as Record<Section, number>,
    errors: [],
  };

  function rows<S extends Section>(section: S): z.output<(typeof rowSchemas)[S]>[] {
    const input = (dataset[section] ?? []) as unknown[];
    const valid: z.output<(typeof rowSchemas)[S]>[] = [];
    input.forEach((row, i) => {
      const parsed = rowSchemas[section].safeParse(row);
      if (parsed.success) valid.push(parsed.data as z.output<(typeof rowSchemas)[S]>);
      else
        stats.errors.push(
          `${section}[${i}]: ${parsed.error.issues.map((iss) => `${iss.path.join(".")} ${iss.message}`).join("; ")}`
        );
    });
    return valid;
  }

  // 1. Brands
  for (const b of rows("brands")) {
    await prisma.brand.upsert({
      where: { name: b.name },
      update: { country: b.country || undefined },
      create: { name: b.name, slug: slugify(b.name), country: b.country },
    });
    stats.created.brands++;
  }

  // 2. Assembly Groups
  for (const a of rows("assemblyGroups")) {
    await prisma.assemblyGroup.upsert({
      where: { name: a.name },
      update: { nameAr: a.nameAr || undefined },
      create: { name: a.name, nameAr: a.nameAr },
    });
    stats.created.assemblyGroups++;
  }

  // 3. Product Groups
  for (const p of rows("productGroups")) {
    let assemblyGroupId: number | undefined;
    if (p.assemblyGroup) {
      const ag = await prisma.assemblyGroup.findUnique({ where: { name: p.assemblyGroup } });
      if (ag) assemblyGroupId = ag.id;
    }
    await prisma.productGroup.upsert({
      where: { name: p.name },
      update: { nameAr: p.nameAr || undefined, assemblyGroupId },
      create: { name: p.name, nameAr: p.nameAr, assemblyGroupId },
    });
    stats.created.productGroups++;
  }

  // 4. Vehicles
  for (const v of rows("vehicles")) {
    const extId = `${v.make}-${v.model}-${v.generation || ""}-${v.yearFrom || 2020}`.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const existing = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { externalVehicleId: extId },
          { make: v.make, model: v.model, yearFrom: v.yearFrom || null },
        ],
      },
    });
    if (!existing) {
      await prisma.vehicle.create({
        data: {
          make: v.make,
          model: v.model,
          generation: v.generation,
          yearFrom: v.yearFrom,
          yearTo: v.yearTo,
          engine: v.engine,
          fuel: v.fuel || "Petrol",
          body: v.body || "SUV",
          marketSpec: (v.marketSpec as any) || "GCC",
          externalVehicleId: extId,
        },
      });
      stats.created.vehicles++;
    }
  }

  // 5. Parts
  for (const pt of rows("parts")) {
    const brand = await prisma.brand.upsert({
      where: { name: pt.brand },
      update: {},
      create: { name: pt.brand, slug: slugify(pt.brand) },
    });

    const norm = normalizePartNumber(pt.partNumber);
    const existingPartNumber = await prisma.partNumber.findFirst({
      where: { numberNormalized: norm },
      select: { partId: true },
    });

    let partId: number;
    if (existingPartNumber) {
      partId = existingPartNumber.partId;
    } else {
      const p = await prisma.part.create({
        data: {
          brandId: brand.id,
          name: pt.name,
          nameAr: pt.nameAr,
          description: pt.description,
          specs: pt.specs || {},
        },
      });
      partId = p.id;
      stats.created.parts++;
    }

    await prisma.partNumber.upsert({
      where: {
        partId_numberNormalized_type_brandName: {
          partId,
          numberNormalized: norm,
          type: "AFTERMARKET",
          brandName: pt.brand,
        },
      },
      update: { isPrimary: true },
      create: {
        partId,
        numberRaw: pt.partNumber,
        numberNormalized: norm,
        type: "AFTERMARKET",
        brandName: pt.brand,
        source: "batch_import",
        isPrimary: true,
      },
    });
  }

  // 6. OE Numbers
  for (const oe of rows("oeNumbers")) {
    const norm = normalizePartNumber(oe.partNumber);
    const targetPart = await prisma.partNumber.findFirst({
      where: { numberNormalized: norm },
      select: { partId: true },
    });
    if (targetPart) {
      const oeNorm = normalizePartNumber(oe.oeNumber);
      await prisma.partNumber.upsert({
        where: {
          partId_numberNormalized_type_brandName: {
            partId: targetPart.partId,
            numberNormalized: oeNorm,
            type: "OE",
            brandName: oe.oeManufacturer,
          },
        },
        update: {},
        create: {
          partId: targetPart.partId,
          numberRaw: oe.oeNumber,
          numberNormalized: oeNorm,
          type: "OE",
          brandName: oe.oeManufacturer,
          source: "batch_import",
        },
      });
      stats.created.oeNumbers++;
    }
  }

  // 7. Cross References
  for (const cr of rows("crossReferences")) {
    const norm = normalizePartNumber(cr.partNumber);
    const targetPart = await prisma.partNumber.findFirst({
      where: { numberNormalized: norm },
      select: { partId: true },
    });
    if (targetPart) {
      const crNorm = normalizePartNumber(cr.targetNumber);
      await prisma.crossReference.create({
        data: {
          partId: targetPart.partId,
          targetNumberRaw: cr.targetNumber,
          targetNumberNorm: crNorm,
          brandName: cr.targetBrand,
          type: cr.type || "EQUIVALENT",
          source: "batch_import",
        },
      });
      stats.created.crossReferences++;
    }
  }

  // 8. Fitments
  for (const ft of rows("fitments")) {
    const norm = normalizePartNumber(ft.partNumber);
    const targetPart = await prisma.partNumber.findFirst({
      where: { numberNormalized: norm },
      select: { partId: true },
    });
    if (targetPart) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { make: ft.make, model: ft.model },
      });
      if (vehicle) {
        await prisma.fitment.upsert({
          where: {
            partId_vehicleId: {
              partId: targetPart.partId,
              vehicleId: vehicle.id,
            },
          },
          update: {},
          create: {
            partId: targetPart.partId,
            vehicleId: vehicle.id,
            sources: ["batch_import"],
            confidence: "SINGLE",
            notes: ft.notes,
          },
        });
        stats.created.fitments++;
      }
    }
  }

  return stats;
}
