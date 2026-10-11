import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get("q") || "").trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getSearchSuggestions(q);
    return NextResponse.json({ suggestions }, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[Suggestions API Error]:", error);
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
