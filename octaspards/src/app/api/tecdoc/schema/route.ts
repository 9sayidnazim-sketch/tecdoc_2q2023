import { NextRequest, NextResponse } from "next/server";
import {
  TABLE_METRICS,
  UNUSED_INDEXES,
  TECDOC_2018_SCHEMA_MAP,
  TECDOC_2017_CR_DELTAS,
} from "@/lib/tecdoc/mockDatabase.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();

  let tables84 = TECDOC_2018_SCHEMA_MAP;
  let metrics = TABLE_METRICS;
  let unused = UNUSED_INDEXES;
  let crDeltas = TECDOC_2017_CR_DELTAS;

  if (q) {
    tables84 = tables84.filter(
      (t: any) =>
        (t.table2018 || t.oldTable || "")?.toLowerCase().includes(q) ||
        (t.table2023 || t.newTable || "")?.toLowerCase().includes(q) ||
        (t.purpose || t.domain || "")?.toLowerCase().includes(q) ||
        (t.recordDiff || t.action || "")?.toLowerCase().includes(q)
    );
    metrics = metrics.filter(
      (m: any) =>
        (m.table_name || "")?.toLowerCase().includes(q) ||
        (m.Engine || m.engine || "")?.toLowerCase().includes(q)
    );
    unused = unused.filter(
      (u: any) =>
        (u.TABLE_NAME || u.table_name || "")?.toLowerCase().includes(q) ||
        (u.INDEX_NAME || u.index_name || "")?.toLowerCase().includes(q)
    );
    crDeltas = crDeltas.filter(
      (c: any) =>
        (c.table || c.crCode || "")?.toLowerCase().includes(q) ||
        (c.domain || c.targetTable || "")?.toLowerCase().includes(q) ||
        (c.operation || c.description || "")?.toLowerCase().includes(q) ||
        (c.sampleEntities || "")?.toLowerCase().includes(q)
    );
  }

  // Summary stats
  const totalDataGb = TABLE_METRICS.reduce((acc: number, m: any) => acc + (m.DataGB ?? m.data_gb ?? 0), 0);
  const totalIndexGb = TABLE_METRICS.reduce((acc: number, m: any) => acc + (m.IndexGB ?? m.index_gb ?? 0), 0);
  const totalTableSizeGb = Number((totalDataGb + totalIndexGb).toFixed(2));
  const totalRows = TABLE_METRICS.reduce((acc: number, m: any) => acc + (m.RowsCount ?? m.approx_rows ?? 0), 0);
  const unusedIndexCount = UNUSED_INDEXES.length;

  return NextResponse.json({
    tables84,
    metrics,
    unusedIndexes: unused,
    crDeltas,
    summary: {
      totalTablesTracked: 84,
      totalTableSizeGb: Math.round(totalTableSizeGb * 10) / 10,
      totalIndexGb: Math.round(totalIndexGb * 10) / 10,
      totalRows,
      unusedIndexCount,
      crDeltaCount: TECDOC_2017_CR_DELTAS.length,
    },
  });
}
