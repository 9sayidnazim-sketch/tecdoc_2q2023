import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { catalogQuerySchema, paramsToObject } from "@/lib/validation";
import type { CatalogOption } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const raw = paramsToObject(request.nextUrl.searchParams);
    const parsed = catalogQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid catalog query parameters",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { kind, manufacturerId, assemblyGroupId } = parsed.data;
    let options: CatalogOption[] = [];

    switch (kind) {
      case "manufacturers": {
        // Distinct vehicle makes from canonical Vehicle table
        const vehicles = await prisma.vehicle.findMany({
          select: { make: true },
          distinct: ["make"],
          orderBy: { make: "asc" },
        });

        options = vehicles.map((v, idx) => ({
          id: idx + 1,
          label: v.make,
          hint: "GCC / Regional",
        }));
        break;
      }

      case "models": {
        // Find make based on manufacturerId or query
        const allMakes = await prisma.vehicle.findMany({
          select: { make: true },
          distinct: ["make"],
          orderBy: { make: "asc" },
        });
        const selectedMake = manufacturerId ? allMakes[manufacturerId - 1]?.make : null;

        const where = selectedMake ? { make: { equals: selectedMake, mode: "insensitive" as const } } : {};
        const models = await prisma.vehicle.findMany({
          where,
          select: { model: true, yearFrom: true, yearTo: true },
          distinct: ["model"],
          orderBy: { model: "asc" },
        });

        options = models.map((m, idx) => ({
          id: idx + 1,
          label: m.model,
          hint: m.yearFrom ? `${m.yearFrom} - ${m.yearTo ?? "present"}` : undefined,
        }));
        break;
      }

      case "vehicle-types":
      case "types": {
        // Return vehicles with their full details
        const rows = await prisma.vehicle.findMany({
          select: {
            id: true,
            make: true,
            model: true,
            generation: true,
            engine: true,
            fuel: true,
            body: true,
            yearFrom: true,
            yearTo: true,
            marketSpec: true,
          },
          orderBy: [{ make: "asc" }, { model: "asc" }],
        });

        options = rows.map((r) => {
          const title = [r.generation, r.engine].filter(Boolean).join(" • ") || `${r.make} ${r.model}`;
          const years = r.yearFrom ? `${r.yearFrom} - ${r.yearTo ?? "present"}` : "All Years";
          return {
            id: r.id,
            label: `${title} (${r.marketSpec})`,
            hint: `${r.fuel || "Petrol"} • ${years}`,
          };
        });
        break;
      }

      case "brands": {
        const brands = await prisma.brand.findMany({
          select: { id: true, name: true, country: true },
          orderBy: { name: "asc" },
        });
        options = brands.map((b) => ({
          id: b.id,
          label: b.name,
          hint: b.country || undefined,
        }));
        break;
      }

      case "assembly-groups": {
        const groups = await prisma.assemblyGroup.findMany({
          select: { id: true, name: true, nameAr: true },
          orderBy: { name: "asc" },
        });
        options = groups.map((g) => ({
          id: g.id,
          label: g.name,
          labelAr: g.nameAr,
        }));
        break;
      }

      case "product-groups": {
        const where = assemblyGroupId ? { assemblyGroupId } : {};
        const pgs = await prisma.productGroup.findMany({
          where,
          select: { id: true, name: true, nameAr: true },
          orderBy: { name: "asc" },
        });
        options = pgs.map((p) => ({
          id: p.id,
          label: p.name,
          labelAr: p.nameAr,
        }));
        break;
      }
    }

    return NextResponse.json(options, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[Catalog API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
