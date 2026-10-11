import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error - local TecDoc module
import { AUTODOC_CATEGORIES, INITIAL_AUTODOC_NEWS } from "@/lib/tecdoc/autodocService.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");
  const q = (searchParams.get("q") || searchParams.get("search") || "").trim().toLowerCase();

  if (id) {
    const num = Number(id);
    const article =
      INITIAL_AUTODOC_NEWS.find((a: any) => String(a.id) === id) ||
      (!isNaN(num) && num >= 1 && num <= INITIAL_AUTODOC_NEWS.length
        ? INITIAL_AUTODOC_NEWS[num - 1]
        : null);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article);
  }

  let list = INITIAL_AUTODOC_NEWS;
  if (category && category !== "all") {
    list = list.filter((a: any) => a.categoryType === category);
  }

  if (q) {
    list = list.filter((a: any) => {
      const titleMatch = (a.title || "").toLowerCase().includes(q);
      const summaryMatch = (a.summary || "").toLowerCase().includes(q);
      const contentMatch = (a.content || "").toLowerCase().includes(q);
      const tagMatch = Array.isArray(a.tags) && a.tags.some((t: string) => t.toLowerCase().includes(q));
      return titleMatch || summaryMatch || contentMatch || tagMatch;
    });
  }

  return NextResponse.json({
    categories: AUTODOC_CATEGORIES,
    articles: list,
    total: list.length,
    query: q || undefined,
  });
}
