import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { bannerInputSchema } from "@/lib/validation";
import type { BannerDto } from "@/lib/types";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    const dtos: BannerDto[] = banners.map((b) => ({
      id: b.id,
      title: b.title,
      titleAr: b.titleAr,
      subtitle: b.subtitle,
      subtitleAr: b.subtitleAr,
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl,
      sortOrder: b.sortOrder,
      active: b.active,
    }));

    return NextResponse.json(dtos);
  } catch (error) {
    console.error("Banners API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token =
      request.headers.get("x-admin-token") ??
      request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN || "octaspards-admin";

    if (token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bannerInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid banner data",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const created = await prisma.banner.create({
      data: parsed.data,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Banners API POST error:", error);
    return NextResponse.json(
      { error: "Internal server error creating banner" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token =
      request.headers.get("x-admin-token") ??
      request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN || "octaspards-admin";

    if (token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = Number(body.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Valid banner id is required" }, { status: 400 });
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        ...(typeof body.active === "boolean" ? { active: body.active } : {}),
        ...(body.title ? { title: body.title } : {}),
        ...(typeof body.sortOrder === "number" ? { sortOrder: body.sortOrder } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Banners API PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error updating banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token =
      request.headers.get("x-admin-token") ??
      request.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN || "octaspards-admin";

    if (token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = Number(searchParams.get("id"));

    if (!id || isNaN(id)) {
      try {
        const body = await request.json();
        id = Number(body.id);
      } catch {
        // ignore JSON parse error
      }
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Valid banner id is required" }, { status: 400 });
    }

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Banners API DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error deleting banner" },
      { status: 500 }
    );
  }
}
