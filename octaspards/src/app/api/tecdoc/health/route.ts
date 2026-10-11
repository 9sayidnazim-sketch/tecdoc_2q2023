import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    engine: "TecDoc 2Q 2023 Virtual Engine",
    dataset: "TecDoc 2Q 2023 / 2018 Legacy / 2017 Delta",
    totalQueries: 42,
    frontend: "Octaspards Automotive Spare-Parts Catalogue",
    integrated: true,
    timestamp: new Date().toISOString()
  });
}
