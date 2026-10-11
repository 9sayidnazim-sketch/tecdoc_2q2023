import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toVehicleSummary } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const step = searchParams.get("step") || "makes";
    const make = searchParams.get("make")?.trim();
    const model = searchParams.get("model")?.trim();
    const yearStr = searchParams.get("year");
    const vehicleIdStr = searchParams.get("vehicleId");

    // Single Vehicle Lookup
    if (vehicleIdStr) {
      const vId = Number(vehicleIdStr);
      if (!vId || isNaN(vId)) {
        return NextResponse.json({ error: "Invalid vehicle ID" }, { status: 400 });
      }
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vId },
      });
      if (!vehicle) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      }
      return NextResponse.json(toVehicleSummary(vehicle));
    }

    // Step 1: Makes
    if (step === "makes") {
      const makes = await prisma.vehicle.findMany({
        select: { make: true },
        distinct: ["make"],
        orderBy: { make: "asc" },
      });
      return NextResponse.json(
        makes.map((m) => ({
          id: m.make,
          label: m.make,
        }))
      );
    }

    // Step 2: Models for given Make
    if (step === "models") {
      if (!make) {
        return NextResponse.json({ error: "Make parameter is required" }, { status: 400 });
      }
      const models = await prisma.vehicle.findMany({
        where: { make: { equals: make, mode: "insensitive" } },
        select: { model: true },
        distinct: ["model"],
        orderBy: { model: "asc" },
      });
      return NextResponse.json(
        models.map((m) => ({
          id: m.model,
          label: m.model,
        }))
      );
    }

    // Step 3: Years for given Make & Model
    if (step === "years") {
      if (!make || !model) {
        return NextResponse.json({ error: "Make and Model parameters are required" }, { status: 400 });
      }
      const vehicles = await prisma.vehicle.findMany({
        where: {
          make: { equals: make, mode: "insensitive" },
          model: { equals: model, mode: "insensitive" },
        },
        select: { yearFrom: true, yearTo: true },
      });

      const yearSet = new Set<number>();
      for (const v of vehicles) {
        const from = v.yearFrom || 2015;
        const to = v.yearTo || new Date().getFullYear();
        for (let y = from; y <= to; y++) {
          yearSet.add(y);
        }
      }
      const sortedYears = Array.from(yearSet).sort((a, b) => b - a);

      return NextResponse.json(
        sortedYears.map((y) => ({
          id: y,
          label: String(y),
        }))
      );
    }

    // Step 4: Engines / Variants for given Make, Model, and Year
    if (step === "engines") {
      if (!make || !model) {
        return NextResponse.json({ error: "Make and Model parameters are required" }, { status: 400 });
      }
      const year = yearStr ? Number(yearStr) : null;
      const vehicles = await prisma.vehicle.findMany({
        where: {
          make: { equals: make, mode: "insensitive" },
          model: { equals: model, mode: "insensitive" },
          ...(year
            ? {
                OR: [
                  {
                    yearFrom: { lte: year },
                    yearTo: { gte: year },
                  },
                  {
                    yearFrom: { lte: year },
                    yearTo: null,
                  },
                  {
                    yearFrom: null,
                    yearTo: null,
                  },
                ],
              }
            : {}),
        },
        orderBy: [{ generation: "asc" }, { engine: "asc" }],
      });

      return NextResponse.json(
        vehicles.map((v) => ({
          id: v.id,
          label: [v.generation, v.engine, v.fuel].filter(Boolean).join(" • ") || `${v.make} ${v.model}`,
          generation: v.generation,
          engine: v.engine,
          fuel: v.fuel,
          marketSpec: v.marketSpec,
          years: v.yearFrom ? `${v.yearFrom} - ${v.yearTo || "present"}` : "All Years",
        }))
      );
    }

    // Step 5: Categories for Vehicle
    if (step === "categories") {
      const vId = Number(searchParams.get("targetVehicleId") || vehicleIdStr);
      if (!vId) {
        return NextResponse.json({ error: "targetVehicleId is required" }, { status: 400 });
      }
      const fittingParts = await prisma.fitment.findMany({
        where: { vehicleId: vId },
        select: {
          part: {
            select: {
              assemblyGroup: { select: { id: true, name: true, nameAr: true } },
              productGroup: { select: { id: true, name: true, nameAr: true } },
            },
          },
        },
      });

      const groupMap = new Map<number, { id: number; name: string; nameAr: string | null; partCount: number }>();
      for (const fp of fittingParts) {
        const ag = fp.part.assemblyGroup;
        if (ag) {
          const current = groupMap.get(ag.id);
          if (current) current.partCount++;
          else groupMap.set(ag.id, { id: ag.id, name: ag.name, nameAr: ag.nameAr, partCount: 1 });
        }
      }

      return NextResponse.json(Array.from(groupMap.values()));
    }

    return NextResponse.json({ error: "Invalid step parameter" }, { status: 400 });
  } catch (error) {
    console.error("[Vehicles API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
