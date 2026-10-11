import { NextRequest, NextResponse } from "next/server";
import { getPartDetail } from "@/lib/search";
import { idParamSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const parsed = idParamSchema.safeParse(resolvedParams);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid part ID: must be a positive integer" },
        { status: 400 }
      );
    }

    const part = await getPartDetail(parsed.data.id);

    if (!part) {
      return NextResponse.json(
        { error: "Part not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(part, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[Part Detail API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
