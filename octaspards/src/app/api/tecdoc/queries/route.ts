import { NextRequest, NextResponse } from "next/server";
import { TECDOC_QUERIES } from "@/lib/tecdoc/queriesData.js";
import { executeTecDocQuery } from "@/lib/tecdoc/mockDatabase.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");

  if (id) {
    const cleanId = id.trim().toLowerCase();
    const q = TECDOC_QUERIES.find(
      (item: any) =>
        item.id?.toLowerCase() === cleanId ||
        item.id?.toLowerCase() === `q_${cleanId}` ||
        item.id?.toLowerCase() === `q${cleanId}` ||
        item.filename?.toLowerCase() === cleanId ||
        item.filename?.toLowerCase() === `${cleanId}.sql`
    );
    if (!q) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }
    return NextResponse.json(q);
  }

  let list = TECDOC_QUERIES;
  if (category && category !== "all") {
    list = list.filter((item: any) => item.category === category);
  }

  return NextResponse.json({
    total: list.length,
    queries: list
  });
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.headers.get("x-admin-token") ??
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
      new URL(req.url).searchParams.get("token");
    const adminToken = process.env.ADMIN_TOKEN || "octaspards-admin-secret-key-2026";

    if (token !== adminToken) {
      return NextResponse.json(
        { error: "Unauthorized. Administrator authorization required to execute SQL queries." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { queryId, params } = body;

    if (!queryId) {
      return NextResponse.json({ error: "queryId is required" }, { status: 400 });
    }

    const cleanId = String(queryId).trim().toLowerCase();
    const queryDef = TECDOC_QUERIES.find(
      (q: any) =>
        q.id?.toLowerCase() === cleanId ||
        q.id?.toLowerCase() === `q_${cleanId}` ||
        q.id?.toLowerCase() === `q${cleanId}` ||
        q.filename?.toLowerCase() === cleanId ||
        q.filename?.toLowerCase() === `${cleanId}.sql`
    );
    if (!queryDef) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    // Execute with simulated TecDoc engine
    const execution = executeTecDocQuery(queryDef, params || queryDef.defaultParams || {});

    return NextResponse.json({
      queryId: queryDef.id,
      title: queryDef.titleEn,
      filename: queryDef.filename,
      paramsUsed: params || queryDef.defaultParams || {},
      ...execution,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to execute query" }, { status: 500 });
  }
}

