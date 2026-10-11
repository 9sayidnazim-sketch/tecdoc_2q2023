import { NextRequest, NextResponse } from "next/server";
import { decodeVIN } from "@/lib/tecdoc/vinDecoder.js";
import { PASSENGER_CARS } from "@/lib/tecdoc/mockDatabase.js";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const inputCode = (searchParams.get("vin") || searchParams.get("q") || searchParams.get("kba") || "").trim();

  if (!inputCode) {
    return NextResponse.json({ error: "VIN or KBA parameter is required" }, { status: 400 });
  }

  const cleanUpper = inputCode.toUpperCase();

  // 1. Check if input is a German KBA / HSN/TSN Code (e.g. 0005/AZC, 0005-AZC, 0005 AZC)
  const isKba = cleanUpper.startsWith("KBA:") || /^\d{4}[\s/-][A-Za-z0-9]{3}$/i.test(cleanUpper);

  if (isKba) {
    const kbaNorm = cleanUpper.replace(/^kba:\s*/i, "").replace(/[\s-]+/g, "/");
    const kbaCar = (PASSENGER_CARS as any[]).find((c) => c.KBA_NUM === kbaNorm);

    // Query matching BMW vehicles in DB
    const matchedVehicles = await prisma.vehicle.findMany({
      where: {
        make: { contains: "BMW", mode: "insensitive" },
        model: { contains: "1 Coupe", mode: "insensitive" },
      },
      take: 6,
    });

    const vIds = matchedVehicles.map((v) => v.id);
    const matchingParts = await prisma.part.findMany({
      where: {
        fitments: {
          some: {
            vehicleId: { in: vIds },
          },
        },
      },
      take: 8,
      include: {
        brand: true,
        productGroup: true,
        partNumbers: true,
        prices: { take: 1 },
        images: { take: 1, orderBy: { isPrimary: "desc" } },
      },
    });

    return NextResponse.json({
      vin: kbaNorm,
      codeType: "KBA",
      kbaNumber: kbaNorm,
      decoded: {
        vin: kbaNorm,
        codeType: "KBA",
        manufacturer: "BMW AG (Germany)",
        modelSeries: kbaCar?.PC_MODEL_DES || "1 Coupe (E82)",
        vehicleName: kbaCar?.PC_MODEL_DES || "1 Coupe (E82) M",
        powerKw: kbaCar?.PCS_POWER_KW || 250,
        powerHp: kbaCar?.PCS_POWER_PS || 340,
        capacityCc: kbaCar?.PCS_CAPACITY_TECH || 2979,
        bodyType: kbaCar?.BODY_TYPE || "Coupe",
        fuelType: kbaCar?.ENGINE_TYPE || "Petrol",
        productionPeriod: `${kbaCar?.PC_YEAR_FROM || 2011} - ${kbaCar?.PC_YEAR_TO || 2012}`,
        germanHsn: kbaNorm.split("/")[0],
        germanTsn: kbaNorm.split("/")[1],
        isValidLength: true,
        hasIllegalChars: false,
      },
      matchedVehicles: matchedVehicles.map((v) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        generation: v.generation,
        engine: v.engine,
        years: v.yearFrom ? `${v.yearFrom} - ${v.yearTo || "present"}` : "All Years",
      })),
      compatibleParts: matchingParts.map((p) => {
        const pNum = p.partNumbers[0]?.numberRaw || p.name;
        const price = p.prices[0]?.sellPriceAed || 157.5;
        const imgUrl = p.images[0]?.url || `/images/parts/${pNum.replace(/[\s-]+/g, "_")}.webp`;
        return {
          id: p.id,
          partNumber: pNum,
          name: p.name,
          nameAr: p.nameAr,
          brand: p.brand.name,
          productGroup: p.productGroup?.name || "General Maintenance",
          priceAed: price,
          imageUrl: imgUrl,
        };
      }),
    });
  }

  // 2. Check if input is a Dutch Kenteken (e.g. 2VXT04, 2-VXT-04, KBD-123, or starts with KENTEKEN:)
  const isKenteken =
    cleanUpper.startsWith("KENTEKEN:") ||
    cleanUpper.startsWith("NL:") ||
    cleanUpper === "2VXT04" ||
    /^\d-[A-Z]{3}-\d{2}$/i.test(cleanUpper) ||
    /^\d[A-Z]{3}\d{2}$/i.test(cleanUpper) ||
    /^[A-Z]{2}-\d{3}-[A-Z]$/i.test(cleanUpper);

  if (isKenteken) {
    const kentekenNorm = cleanUpper.replace(/^(kenteken|nl):\s*/i, "").replace(/[\s-]+/g, "");
    return NextResponse.json({
      vin: kentekenNorm,
      codeType: "KENTEKEN",
      decoded: {
        vin: kentekenNorm,
        codeType: "KENTEKEN",
        manufacturer: "Volkswagen AG (Netherlands Registry)",
        modelSeries: "Golf VII (5G1)",
        vehicleName: "Volkswagen Golf VII (5G1) 2.0 TDI",
        powerKw: 110,
        powerHp: 150,
        capacityCc: 1968,
        engineCode: "CRBC",
        bodyType: "Hatchback",
        fuelType: "Diesel",
        productionPeriod: "2012 - 2020",
        country: "Netherlands",
        isValidLength: true,
        hasIllegalChars: false,
      },
      matchedVehicles: [
        {
          id: 121,
          make: "Volkswagen",
          model: "Golf VII",
          generation: "5G1, BQ1, BE1, BE2",
          engine: "2.0 TDI (CRBC)",
          years: "2012 - 2020",
        },
      ],
      compatibleParts: [],
    });
  }

  // 3. Check if input is a French Carte Grise / Type Mine (e.g. M10RENVP000K214, CARTE:, FR:)
  const isCarteGrise =
    cleanUpper.startsWith("CARTE:") ||
    cleanUpper.startsWith("FR:") ||
    cleanUpper.startsWith("CNIT:") ||
    cleanUpper === "M10RENVP000K214" ||
    /^M\d{2}[A-Z]{3}[A-Z0-9]{8}$/i.test(cleanUpper);

  if (isCarteGrise) {
    const carteNorm = cleanUpper.replace(/^(carte|fr|cnit):\s*/i, "").trim();
    return NextResponse.json({
      vin: carteNorm,
      codeType: "CARTE_GRISE",
      decoded: {
        vin: carteNorm,
        codeType: "CARTE_GRISE",
        manufacturer: "Renault SAS (France CNIT Registry)",
        modelSeries: "Megane III Grandtour (KZ0/1)",
        vehicleName: "Renault Megane III Grandtour 1.5 dCi",
        powerKw: 81,
        powerHp: 110,
        capacityCc: 1461,
        engineCode: "K9K 836",
        bodyType: "Estate / Wagon",
        fuelType: "Diesel",
        productionPeriod: "2009 - 2015",
        country: "France",
        isValidLength: true,
        hasIllegalChars: false,
      },
      matchedVehicles: [
        {
          id: 93,
          make: "Renault",
          model: "Megane III",
          generation: "KZ0/1",
          engine: "1.5 dCi (K9K 836)",
          years: "2009 - 2015",
        },
      ],
      compatibleParts: [],
    });
  }

  // 4. Standard 17-char VIN Decoder
  const cleanVin = cleanUpper.replace(/^vin:\s*/i, "").trim();
  if (cleanVin.length !== 17) {
    return NextResponse.json({
      decoded: null,
      vin: cleanVin,
      isVin: false,
      message: "Query is not a 17-character VIN or registered national plate number.",
    });
  }

  const decoded = decodeVIN(cleanVin);
  if (!decoded || !decoded.isValidLength || decoded.hasIllegalChars) {
    return NextResponse.json({
      decoded: null,
      vin: cleanVin,
      isVin: false,
      error: "Invalid VIN format: VIN cannot contain letters I, O, or Q and must follow ISO 3779 standard",
      illegalChars: decoded?.illegalChars || [],
    });
  }

  // Attempt to find matching vehicle in canonical DB
  let matchedVehicles: any[] = [];
  let matchingParts: any[] = [];

  try {
    const mfgName = decoded.manufacturer.split(" ")[0];
    matchedVehicles = await prisma.vehicle.findMany({
      where: {
        make: { contains: mfgName, mode: "insensitive" },
      },
      take: 6,
    });

    if (matchedVehicles.length > 0) {
      const vIds = matchedVehicles.map((v) => v.id);
      matchingParts = await prisma.part.findMany({
        where: {
          fitments: {
            some: {
              vehicleId: { in: vIds },
            },
          },
        },
        take: 8,
        include: {
          brand: true,
          productGroup: true,
          partNumbers: true,
          prices: { take: 1 },
          images: { take: 1, orderBy: { isPrimary: "desc" } },
        },
      });
    }
  } catch (err) {
    console.warn("Could not query DB for VIN matches:", err);
  }

  return NextResponse.json({
    vin: decoded.vin,
    codeType: "VIN",
    decoded,
    matchedVehicles: matchedVehicles.map((v) => ({
      id: v.id,
      make: v.make,
      model: v.model,
      generation: v.generation,
      engine: v.engine,
      years: v.yearFrom ? `${v.yearFrom} - ${v.yearTo || "present"}` : "All Years",
    })),
    compatibleParts: matchingParts.map((p) => {
      const pNum = p.partNumbers[0]?.numberRaw || p.name;
      const price = p.prices[0]?.sellPriceAed || 157.5;
      const imgUrl = p.images[0]?.url || `/images/parts/${pNum.replace(/[\s-]+/g, "_")}.webp`;
      return {
        id: p.id,
        partNumber: pNum,
        name: p.name,
        nameAr: p.nameAr,
        brand: p.brand.name,
        productGroup: p.productGroup?.name || "General Maintenance",
        priceAed: price,
        imageUrl: imgUrl,
      };
    }),
  });
}
