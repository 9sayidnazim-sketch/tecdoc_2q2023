import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";
import { checkRateLimit } from "@/lib/rateLimit";
import { paramsToObject, searchQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting (60 requests per minute per IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 60, 60_000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many search requests. Please slow down and try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.reset),
          },
        }
      );
    }

    // 2. Validate & Sanitize Input
    const rawParams = paramsToObject(request.nextUrl.searchParams);
    const parsed = searchQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    // 3. Extract API Key (header, query, or env)
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      parsed.data.apiKey ||
      parsed.data.api_key ||
      parsed.data.key ||
      process.env.TECDOC_API_KEY ||
      undefined;

    // 4. Execute Search with all keys
    const result = await search({
      ...parsed.data,
      apiKey,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(rateLimit.reset),
      },
    });
  } catch (error) {
    // Log real internal error server-side ONLY. Never expose internal stack/columns to client.
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
