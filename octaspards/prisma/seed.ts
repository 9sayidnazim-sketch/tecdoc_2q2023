import { PrismaClient } from "@prisma/client";
import { runIngestionPipeline } from "../src/lib/ingest/pipeline";

async function main() {
  const prisma = new PrismaClient();
  const started = Date.now();
  console.log("Starting UAE TecDoc Ingestion & Merge Pipeline...");
  try {
    const stats = await runIngestionPipeline(prisma);
    console.log("=== INGESTION & MERGE COMPLETED ===");
    console.table(stats);

    const counts = {
      brands: await prisma.brand.count(),
      parts: await prisma.part.count(),
      partNumbers: await prisma.partNumber.count(),
      vehicles: await prisma.vehicle.count(),
      fitments: await prisma.fitment.count(),
      verifiedFitments: await prisma.fitment.count({ where: { confidence: "VERIFIED" } }),
      crossReferences: await prisma.crossReference.count(),
      images: await prisma.partImage.count(),
      prices: await prisma.partPrice.count(),
      sourceRecords: await prisma.sourceRecord.count(),
      banners: await prisma.banner.count(),
    };
    console.log("=== DATABASE RECORD COUNTS ===");
    console.table(counts);

    console.log(`Pipeline completed successfully in ${((Date.now() - started) / 1000).toFixed(2)}s`);
  } catch (error) {
    console.error("Ingestion pipeline failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
