import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imgId = Number(id);

    if (!imgId || isNaN(imgId)) {
      return NextResponse.redirect(new URL("/api/images/placeholder", request.url));
    }

    const image = await prisma.partImage.findUnique({
      where: { id: imgId },
      select: { url: true, thumbnailUrl: true },
    });

    if (!image || !image.url) {
      return NextResponse.redirect(new URL("/api/images/placeholder", request.url));
    }

    const isThumb = request.nextUrl.searchParams.get("thumb") === "1";
    const targetUrl = isThumb && image.thumbnailUrl ? image.thumbnailUrl : image.url;

    // If local path, rewrite or redirect
    if (targetUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    // If external URL, redirect securely with caching headers
    return NextResponse.redirect(targetUrl, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch (err) {
    console.error("[Image Proxy Error]:", err);
    return NextResponse.redirect(new URL("/api/images/placeholder", request.url));
  }
}
