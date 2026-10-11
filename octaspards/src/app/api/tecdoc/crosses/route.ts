import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePartNumber } from "@/lib/normalize";
import { ARTICLES, PASSENGER_CARS } from "@/lib/tecdoc/mockDatabase.js";
import { decodeVIN } from "@/lib/tecdoc/vinDecoder.js";
import { TecDocSDK } from "@/lib/tecdoc/tecdocSdk.js";

function mapDbPartToCrossMatch(p: any) {
  const primaryNum =
    p.partNumbers?.find((n: any) => n.isPrimary)?.numberRaw ||
    p.partNumbers?.[0]?.numberRaw ||
    p.name;

  const oeList = (p.partNumbers || [])
    .filter((n: any) => n.type === "OE")
    .map((n: any) => ({
      id: String(n.id),
      brand: n.brandName || "Genuine OE",
      oemNumber: n.numberRaw,
    }));

  const afterList = (p.crossReferences || []).map((c: any) => ({
    id: String(c.id),
    brand: c.brandName,
    number: c.targetNumberRaw,
    type: c.referenceType || "EQUIVALENT",
  }));

  const price = p.prices?.[0];
  const primaryImg = p.images?.find((img: any) => img.isPrimary) || p.images?.[0];
  const imageUrl = primaryImg?.url || `/images/parts/${primaryNum.replace(/[\s-]+/g, "_")}.webp`;

  return {
    id: p.id,
    partNumber: primaryNum,
    brand: p.brand?.name || "Unknown Brand",
    name: p.name,
    productGroup: p.productGroup?.name || "General Maintenance",
    priceAed: price ? price.sellPriceAed : 185.0,
    stockStatus: price ? price.stockStatus : "IN_STOCK",
    imageUrl,
    images: p.images?.length
      ? p.images
      : [{ id: 1, url: imageUrl, thumbnailUrl: imageUrl, isPrimary: true, altText: p.name }],
    specs: (p.specs as Record<string, any>) || {},
    oeCrosses: oeList,
    aftermarketCrosses: afterList,
    oeEquivalents: oeList.map((o: any) => o.oemNumber),
    aftermarketEquivalents: afterList.map((a: any) => `${a.brand} ${a.number}`),
    fitmentCount: p.fitments?.length || 0,
    applications: (p.fitments || []).map((f: any) => ({
      car: `${f.vehicle?.make || ""} ${f.vehicle?.model || ""}`.trim(),
      year: `${f.vehicle?.yearFrom || ""}${f.vehicle?.yearTo ? `-${f.vehicle?.yearTo}` : " - present"}`,
      engine: f.vehicle?.engine || f.vehicle?.engineCode || undefined,
    })),
    vehicles: (p.fitments || []).map(
      (f: any) =>
        `${f.vehicle?.make || ""} ${f.vehicle?.model || ""} (${f.vehicle?.yearFrom || ""}-${f.vehicle?.yearTo || "present"})`
    ),
  };
}

function mapVirtualArticleToCrossMatch(art: any) {
  const specs: Record<string, any> = {};
  if (Array.isArray(art.CRITERIA)) {
    for (const c of art.CRITERIA) {
      if (c && c.CRI_NAME) specs[c.CRI_NAME] = String(c.CRI_VALUE || "");
    }
  }

  const oeList = (art.CROSSES || [])
    .filter((c: any) => c.TYPE?.toLowerCase().includes("oe") || c.BRAND?.toLowerCase().includes("oe"))
    .map((c: any, idx: number) => ({
      id: String(idx + 1),
      brand: c.BRAND || "Genuine OE",
      oemNumber: c.NUMBER,
    }));

  const afterList = (art.CROSSES || [])
    .filter((c: any) => !c.TYPE?.toLowerCase().includes("oe") && !c.BRAND?.toLowerCase().includes("oe"))
    .map((c: any, idx: number) => ({
      id: String(idx + 100),
      brand: c.BRAND || "Aftermarket",
      number: c.NUMBER,
      type: "EQUIVALENT",
    }));

  const imgUrl = `/images/parts/${art.ART_ARTICLE_NR.replace(/[\s-]+/g, "_")}.webp`;

  return {
    id: art.ART_ID || 99000,
    partNumber: art.ART_ARTICLE_NR,
    brand: art.ART_SUP_BRAND || "TecDoc Brand",
    name: art.ART_PRODUCT_NAME,
    productGroup: art.ART_PRODUCT_NAME,
    priceAed: 157.5,
    stockStatus: "IN_STOCK",
    imageUrl: imgUrl,
    images: [{ id: 1, url: imgUrl, thumbnailUrl: imgUrl, isPrimary: true, altText: art.ART_PRODUCT_NAME }],
    specs,
    oeCrosses: oeList,
    aftermarketCrosses: afterList,
    oeEquivalents: oeList.map((o: any) => o.oemNumber),
    aftermarketEquivalents: afterList.map((a: any) => `${a.brand} ${a.number}`),
    fitmentCount: (art.FITMENT || []).length,
    applications: (art.FITMENT || []).map((f: any) => ({
      car: `${f.BRAND || ""} ${f.MODEL || ""}`.trim(),
      year: f.YEARS || "2006 - 2013",
      engine: f.KW ? `${f.KW} kW / ${f.HP || f.KW * 1.36} HP` : undefined,
    })),
    vehicles: (art.FITMENT || []).map(
      (f: any) => `${f.BRAND || ""} ${f.MODEL || ""} (${f.YEARS || "2006-2013"})`
    ),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = (searchParams.get("q") || searchParams.get("article") || "").trim();
    const query = rawQuery.toUpperCase();

    // Extract API key from headers or params
    const apiKey =
      req.headers.get("x-api-key") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      searchParams.get("apiKey") ||
      searchParams.get("key") ||
      searchParams.get("api_key") ||
      process.env.TECDOC_API_KEY ||
      undefined;

    // If no query provided, return sample cross-referenced parts from database
    if (!query) {
      const topParts = await prisma.part.findMany({
        take: 12,
        include: {
          brand: true,
          productGroup: true,
          partNumbers: { take: 5 },
          crossReferences: { take: 6 },
          fitments: {
            take: 6,
            include: { vehicle: true },
          },
          prices: {
            take: 1,
            orderBy: { sellPriceAed: "asc" },
          },
          images: {
            take: 1,
            orderBy: { isPrimary: "desc" },
          },
        },
      });

      const mappedSamples = topParts.map(mapDbPartToCrossMatch);

      return NextResponse.json({
        query: "",
        normalized: "",
        count: mappedSamples.length,
        dbMatches: mappedSamples,
        crosses: mappedSamples,
        tecdocMatches: [],
        examples: ["0 986 494 124", "04465-60320", "P 83 150", "W 712/75", "20430"],
        apiKeyActive: Boolean(apiKey),
      });
    }

    const normalized = normalizePartNumber(query);
    const dbMatches: any[] = [];
    let partIds: number[] = [];

    // 0a. Check if input is a VIN
    const isVin =
      query.startsWith("VIN:") ||
      (query.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(query)) ||
      (query.length >= 10 && Boolean(decodeVIN(query)?.isValidLength));

    if (isVin) {
      const vinCode = query.replace(/^vin:\s*/i, "").trim();
      const vinInfo = decodeVIN(vinCode);
      if (vinInfo && vinInfo.manufacturer && vinInfo.manufacturer !== "Unknown Manufacturer") {
        const mfgPrefix = vinInfo.manufacturer.split(" ")[0];
        const vMatches = await prisma.vehicle.findMany({
          where: { make: { contains: mfgPrefix, mode: "insensitive" } },
          select: { id: true },
          take: 6,
        });
        if (vMatches.length > 0) {
          const vIds = vMatches.map((v) => v.id);
          const pRows = await prisma.part.findMany({
            where: { fitments: { some: { vehicleId: { in: vIds } } } },
            select: { id: true },
            take: 15,
          });
          partIds.push(...pRows.map((p) => p.id));
        }
      }
    }

    // 0b. Check if input is a German KBA (e.g. 0005/AZC)
    const isKba = query.startsWith("KBA:") || /^\d{4}[\s/-][A-Za-z0-9]{3}$/i.test(query);
    if (isKba) {
      const kbaCode = query.replace(/^kba:\s*/i, "").replace(/[\s-]+/g, "/");
      const kbaCar = (PASSENGER_CARS as any[]).find((c) => c.KBA_NUM === kbaCode);
      if (kbaCar) {
        const vMatches = await prisma.vehicle.findMany({
          where: { make: { contains: "BMW", mode: "insensitive" } },
          select: { id: true },
          take: 6,
        });
        if (vMatches.length > 0) {
          const vIds = vMatches.map((v) => v.id);
          const pRows = await prisma.part.findMany({
            where: { fitments: { some: { vehicleId: { in: vIds } } } },
            select: { id: true },
            take: 15,
          });
          partIds.push(...pRows.map((p) => p.id));
        }
      }
    }

    // 1. Search in canonical database by part number or cross reference
    if (normalized) {
      const matchingPartNumbers = await prisma.partNumber.findMany({
        where: {
          OR: [
            { numberNormalized: normalized },
            { numberNormalized: { startsWith: normalized } },
            ...(normalized.length >= 4 ? [{ numberNormalized: { contains: normalized } }] : []),
          ],
        },
        select: { partId: true },
        take: 20,
      });

      const matchingCrosses = await prisma.crossReference.findMany({
        where: {
          OR: [
            { targetNumberNorm: normalized },
            { targetNumberNorm: { startsWith: normalized } },
            ...(normalized.length >= 4 ? [{ targetNumberNorm: { contains: normalized } }] : []),
          ],
        },
        select: { partId: true },
        take: 20,
      });

      partIds.push(
        ...matchingPartNumbers.map((m) => m.partId),
        ...matchingCrosses.map((m) => m.partId)
      );
    }

    partIds = Array.from(new Set(partIds));

    // Fallback: search by name, brand, aftermarket brand or vehicle if no exact part numbers matched
    if (partIds.length === 0 && query.length >= 2) {
      const nameParts = await prisma.part.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { name: { contains: query, mode: "insensitive" } } },
            { crossReferences: { some: { brandName: { contains: query, mode: "insensitive" } } } },
            { partNumbers: { some: { brandName: { contains: query, mode: "insensitive" } } } },
            {
              fitments: {
                some: {
                  vehicle: {
                    OR: [
                      { make: { contains: query, mode: "insensitive" } },
                      { model: { contains: query, mode: "insensitive" } },
                    ],
                  },
                },
              },
            },
          ],
        },
        select: { id: true },
        take: 10,
      });
      partIds = nameParts.map((p) => p.id);
    }

    if (partIds.length > 0) {
      const parts = await prisma.part.findMany({
        where: { id: { in: partIds } },
        take: 10,
        include: {
          brand: true,
          productGroup: true,
          partNumbers: true,
          crossReferences: true,
          fitments: {
            take: 6,
            include: { vehicle: true },
          },
          prices: {
            take: 1,
            orderBy: { sellPriceAed: "asc" },
          },
          images: {
            take: 1,
            orderBy: { isPrimary: "desc" },
          },
        },
      });

      dbMatches.push(...parts.map(mapDbPartToCrossMatch));
    }

    // Match in TecDoc master articles (e.g. SPIDAN 20430, HELLA, etc.)
    const tecdocMatches: any[] = [];
    try {
      if (Array.isArray(ARTICLES)) {
        for (const art of ARTICLES) {
          const artNrNorm = normalizePartNumber(art.ART_ARTICLE_NR || "");
          const isArtMatch =
            normalized && (artNrNorm === normalized || artNrNorm.includes(normalized) || normalized.includes(artNrNorm));

          const isCrossMatch =
            normalized &&
            Array.isArray(art.CROSSES) &&
            art.CROSSES.some((c: any) => {
              const cNorm = normalizePartNumber(c.NUMBER || "");
              return cNorm === normalized || cNorm.includes(normalized) || normalized.includes(cNorm);
            });

          const isBrandOrNameMatch =
            (art.ART_SUP_BRAND && art.ART_SUP_BRAND.toUpperCase().includes(query)) ||
            (art.ART_PRODUCT_NAME && art.ART_PRODUCT_NAME.toUpperCase().includes(query));

          if (isArtMatch || isCrossMatch || (dbMatches.length === 0 && isBrandOrNameMatch)) {
            tecdocMatches.push(mapVirtualArticleToCrossMatch(art));
          }
        }
      }
    } catch (e) {
      console.warn("Could not query TecDoc articles:", e);
    }

    // If API key is provided and live Pegasus client is available, merge external crosses
    if (apiKey && apiKey !== "virtual") {
      try {
        const sdk = new TecDocSDK({
          apiKey,
          mode: "pegasus_rest",
        });
        const liveArticles = await sdk.searchArticles({ query, searchExact: false });
        if (liveArticles?.data?.length) {
          for (const pa of liveArticles.data) {
            if (
              !dbMatches.some((m) => m.partNumber === pa.articleNo) &&
              !tecdocMatches.some((m) => m.partNumber === pa.articleNo)
            ) {
              const imgUrl = "/images/parts/placeholder.webp";
              tecdocMatches.push({
                id: pa.articleId || Date.now(),
                partNumber: pa.articleNo,
                brand: pa.brandName || "Pegasus Live Brand",
                name: pa.articleName || "Live Certified Article",
                productGroup: pa.articleName || "Live Catalog",
                priceAed: 185.0,
                stockStatus: "IN_STOCK",
                imageUrl: imgUrl,
                images: [{ id: 1, url: imgUrl, thumbnailUrl: imgUrl, isPrimary: true, altText: pa.articleName }],
                specs: {},
                oeCrosses: [],
                aftermarketCrosses: [],
                oeEquivalents: [],
                aftermarketEquivalents: [],
                fitmentCount: 1,
                applications: [{ car: "Global Vehicle Match", year: "2015-2024", engine: undefined }],
                vehicles: ["Global Vehicle Match (2015-2024)"],
              });
            }
          }
        }
      } catch (e) {
        console.warn("Pegasus live crosses lookup failed, safely fell back:", e);
      }
    }

    // Unified crosses list ensures neither tab nor cards are empty
    const unifiedCrosses = dbMatches.length > 0 ? dbMatches : tecdocMatches;

    return NextResponse.json({
      query,
      normalized,
      count: dbMatches.length + tecdocMatches.length,
      dbMatches,
      tecdocMatches,
      crosses: unifiedCrosses,
      apiKeyActive: Boolean(apiKey),
    });
  } catch (error) {
    console.error("[TecDoc Crosses API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again.", dbMatches: [], tecdocMatches: [], crosses: [] },
      { status: 500 }
    );
  }
}
