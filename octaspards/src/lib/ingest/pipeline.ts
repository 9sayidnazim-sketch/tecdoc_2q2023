import { PrismaClient } from "@prisma/client";
import { TecDocAdapter } from "./adapters/tecdocAdapter";
import { OemAdapter } from "./adapters/oemAdapter";
import { AutodocAdapter } from "./adapters/autodocAdapter";
import { DubaiSupplierAdapter } from "./adapters/dubaiSupplierAdapter";
import { mergePartIntoDatabase, type MergeStats } from "./merger";
import type { ApiSourceAdapter } from "./types";

export async function runIngestionPipeline(prisma: PrismaClient): Promise<MergeStats> {
  const stats: MergeStats = {
    partsProcessed: 0,
    partsCreated: 0,
    partsUpdated: 0,
    numbersLinked: 0,
    crossesLinked: 0,
    fitmentsCreated: 0,
    fitmentsVerified: 0,
    imagesStored: 0,
    pricesRecorded: 0,
    sourceRecordsLogged: 0,
  };

  // Adapters in strict trust priority order:
  // 1. TecDoc Official (Master Aftermarket catalog)
  // 2. OEM EPC (Genuine manufacturer data)
  // 3. Autodoc Feed (Aftermarket equivalents & kits)
  // 4. Dubai Central Parts (Local UAE warehouse stock & AED prices)
  const adapters: ApiSourceAdapter[] = [
    new TecDocAdapter(),
    new OemAdapter(),
    new AutodocAdapter(),
    new DubaiSupplierAdapter(),
  ];

  for (const adapter of adapters) {
    let attempts = 0;
    const maxAttempts = 3;
    let parts: any[] = [];

    while (attempts < maxAttempts) {
      try {
        attempts++;
        parts = await adapter.fetchParts();
        break;
      } catch (err) {
        console.warn(`[Ingest Adapter ${adapter.name}] Attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          console.error(`[Ingest Adapter ${adapter.name}] Max retries reached. Skipping.`);
          break;
        }
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 200));
      }
    }

    for (const partInput of parts) {
      try {
        stats.partsProcessed++;
        const res = await mergePartIntoDatabase(prisma, partInput);
        if (res.isNew) {
          stats.partsCreated++;
        } else {
          stats.partsUpdated++;
        }
      } catch (err) {
        console.error(`[Ingest Merge Error for ${partInput.name}]:`, err);
      }
    }
  }

  // Ensure banners exist for home page carousel
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: "Genuine Toyota Land Cruiser 300 & Lexus LX600 Parts",
          titleAr: "قطع غيار تويوتا لاندكروزر 300 ولزكزس LX600 الأصلية",
          subtitle: "Immediate dispatch from Dubai Logistics Hub. 100% Genuine hologram verified.",
          subtitleAr: "تسليم فوري من مستودعات دبي المركزية بضمان الوكالة الأصلي.",
          imageUrl: "/banners/lc300.jpg",
          linkUrl: "/?q=04465-60320",
          sortOrder: 1,
          active: true,
        },
        {
          title: "Bosch QuietCast Ceramic Technology for UAE Climates",
          titleAr: "فحمات بوش كوايت كاست السيراميكية لمناخ الخليج الحار",
          subtitle: "Zero brake fade up to 650°C. High-performance braking with minimal brake dust.",
          subtitleAr: "أداء فرملة متفوق في درجات الحرارة العالية بدون غبار أو أصوات.",
          imageUrl: "/banners/bosch_brakes.jpg",
          linkUrl: "/?q=0+986+494+124",
          sortOrder: 2,
          active: true,
        },
        {
          title: "Nissan Patrol Y62 V8 Heavy-Duty Suspension & Service Kits",
          titleAr: "مساعدات وبواجي وفحمات نيسان باترول بطل الدروب Y62 V8",
          subtitle: "Complete service maintenance kits with genuine Nissan and KYB components.",
          subtitleAr: "أطقم الصيانة الدورية الشاملة لنيسان باترول بطل الدروب.",
          imageUrl: "/banners/patrol.jpg",
          linkUrl: "/?q=D1060-1KA1A",
          sortOrder: 3,
          active: true,
        },
      ],
    });
  }

  // Query final counts
  stats.numbersLinked = await prisma.partNumber.count();
  stats.crossesLinked = await prisma.crossReference.count();
  stats.fitmentsCreated = await prisma.fitment.count();
  stats.fitmentsVerified = await prisma.fitment.count({
    where: { confidence: "VERIFIED" },
  });
  stats.imagesStored = await prisma.partImage.count();
  stats.pricesRecorded = await prisma.partPrice.count();
  stats.sourceRecordsLogged = await prisma.sourceRecord.count();

  return stats;
}
