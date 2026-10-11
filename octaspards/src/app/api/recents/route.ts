import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { paramsToObject, recentQuerySchema } from "@/lib/validation";
import type { ManufacturerChip } from "@/lib/types";

const COOKIE_NAME = "oct_uid";

function getOrCreateUserKey(request: NextRequest, response: NextResponse): string {
  let uid = request.cookies.get(COOKIE_NAME)?.value;
  if (!uid) {
    uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    response.cookies.set(COOKIE_NAME, uid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return uid;
}

const MAKE_COLORS: Record<string, string> = {
  Toyota: "#C8102E",
  Lexus: "#1A1A1A",
  Nissan: "#C8102E",
  BMW: "#0066B1",
  "Mercedes-Benz": "#0B1F3A",
  Audi: "#BB0A30",
  Volkswagen: "#001E50",
  Ford: "#002C6C",
  Hyundai: "#002C6C",
  Porsche: "#8B0000",
  Bosch: "#EA1B23",
  Brembo: "#E30613",
  KYB: "#E2001A",
  NGK: "#E20613",
  Denso: "#E60012",
};

export async function GET(request: NextRequest) {
  try {
    const raw = paramsToObject(request.nextUrl.searchParams);
    const parsed = recentQuerySchema.safeParse(raw);
    const limit = parsed.success ? parsed.data.limit : 9;

    const res = NextResponse.json([] as ManufacturerChip[]);
    const userKey = getOrCreateUserKey(request, res);

    // Get user recent searches
    const userRecents = await prisma.recentSearch.findMany({
      where: { userKey },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });

    const recentNames = userRecents.map((r) => r.brandName || r.query);

    // Get top distinct makes from Vehicle table
    const vehicleMakes = await prisma.vehicle.findMany({
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
      take: 15,
    });

    const makesList = vehicleMakes.map((v) => v.make);

    // Combine recent and catalogue makes
    const combined = Array.from(new Set([...recentNames, ...makesList])).slice(0, limit);

    const items: ManufacturerChip[] = combined.map((name, idx) => ({
      id: idx + 1,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      color: MAKE_COLORS[name] || "#1F4FE0",
    }));

    return NextResponse.json(items, {
      headers: {
        "Set-Cookie": res.headers.get("Set-Cookie") ?? "",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[Recents API GET Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const res = NextResponse.json({ success: true });
    const userKey = getOrCreateUserKey(request, res);

    const name = String(json.name || json.query || json.manufacturerId || "").trim();
    if (!name) {
      return NextResponse.json({ error: "Missing query or brand name" }, { status: 400 });
    }

    await prisma.recentSearch.upsert({
      where: {
        userKey_query: {
          userKey,
          query: name,
        },
      },
      update: {
        brandName: name,
        updatedAt: new Date(),
      },
      create: {
        userKey,
        query: name,
        brandName: name,
      },
    });

    return res;
  } catch (error) {
    console.error("[Recents API POST Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
