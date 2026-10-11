import type { ApiSourceAdapter, IngestPart, IngestPartNumber, IngestCrossReference, IngestFitment, IngestImage, IngestPrice } from "../types";
import { ARTICLES } from "../../tecdoc/mockDatabase.js";

export class TecDocAdapter implements ApiSourceAdapter {
  readonly name = "tecdoc_official" as const;
  readonly label = "TecDoc 2Q 2023 Official Catalog";

  async fetchParts(): Promise<IngestPart[]> {
    const parts: IngestPart[] = [];

    for (const art of ARTICLES) {
      const mainArtNr = String(art.ART_ARTICLE_NR || "").trim();
      const brandName = String(art.ART_SUP_BRAND || "TecDoc Brand").trim();
      const productName = String(art.ART_PRODUCT_NAME || "Automotive Replacement Component").trim();

      // Numbers
      const numbers: IngestPartNumber[] = [
        {
          numberRaw: mainArtNr,
          type: "AFTERMARKET",
          brandName,
          isPrimary: true,
        },
      ];

      if (art.EAN) {
        numbers.push({
          numberRaw: String(art.EAN).trim(),
          type: "EAN",
          brandName,
        });
      }

      // Cross References
      const crossReferences: IngestCrossReference[] = [];
      if (Array.isArray(art.CROSSES)) {
        for (const cr of art.CROSSES) {
          const numRaw = String(cr.NUMBER || "").trim();
          if (!numRaw) continue;
          const isOe = cr.TYPE?.toLowerCase().includes("oe") || cr.TYPE?.toLowerCase().includes("original");
          if (isOe) {
            numbers.push({
              numberRaw: numRaw,
              type: "OE",
              brandName: String(cr.BRAND || "OEM").trim(),
            });
          }
          crossReferences.push({
            targetNumberRaw: numRaw,
            brandName: String(cr.BRAND || "Aftermarket").trim(),
            type: isOe ? "EQUIVALENT" : "EQUIVALENT",
            source: "tecdoc_official",
          });
        }
      }

      if (Array.isArray(art.OEM_NUMBERS)) {
        for (const oem of art.OEM_NUMBERS) {
          const numRaw = String(oem.DISPLAY_NR || oem.CLEAN_NR || "").trim();
          if (numRaw) {
            numbers.push({
              numberRaw: numRaw,
              type: "OE",
              brandName: String(oem.BRAND || "OEM").trim(),
            });
            crossReferences.push({
              targetNumberRaw: numRaw,
              brandName: String(oem.BRAND || "OEM").trim(),
              type: "EQUIVALENT",
              source: "tecdoc_official",
            });
          }
        }
      }

      // Specs
      const specs: Record<string, string | number | boolean> = {};
      if (Array.isArray(art.CRITERIA)) {
        for (const c of art.CRITERIA) {
          if (c.CRI_NAME && c.CRI_VALUE) {
            specs[String(c.CRI_NAME)] = String(c.CRI_VALUE);
          }
        }
      }

      // Fitments
      const fitments: IngestFitment[] = [];
      if (Array.isArray(art.FITMENT)) {
        for (const fit of art.FITMENT) {
          const brand = String(fit.BRAND || "").trim();
          const model = String(fit.MODEL || "").trim();
          const years = String(fit.YEARS || "").split("-");
          const yearFrom = years[0] ? parseInt(years[0], 10) || undefined : undefined;
          const yearTo = years[1] ? parseInt(years[1], 10) || undefined : undefined;

          fitments.push({
            vehicle: {
              make: brand,
              model,
              yearFrom,
              yearTo,
              engine: fit.ENG_CODE || undefined,
              marketSpec: "GLOBAL",
            },
            source: "tecdoc_official",
            notes: fit.KW ? `${fit.KW} kW / ${fit.HP || ""} HP` : undefined,
          });
        }
      }

      // Images
      const images: IngestImage[] = [
        {
          url: `/images/parts/${encodeURIComponent(mainArtNr.replace(/[^A-Za-z0-9]/g, "_"))}.webp`,
          thumbnailUrl: `/images/parts/${encodeURIComponent(mainArtNr.replace(/[^A-Za-z0-9]/g, "_"))}_thumb.webp`,
          isPrimary: true,
          source: "tecdoc_official",
          altText: `${brandName} ${mainArtNr} - ${productName}`,
        },
      ];

      // Prices (Baseline TecDoc Euro-converted supplier estimate)
      const prices: IngestPrice[] = [
        {
          supplier: "TecDoc Central European Supplier",
          cost: 120.0,
          currency: "AED",
          marginRule: "MARGIN_25_PLUS_VAT_5",
          stockStatus: "IN_STOCK",
          stockQuantity: 15,
        },
      ];

      // Category derivation
      let assemblyGroupName = "Braking System";
      let productGroupName = "Brake Pads";
      if (productName.toLowerCase().includes("filter") || mainArtNr.includes("712") || mainArtNr.includes("959")) {
        assemblyGroupName = "Filters";
        productGroupName = productName.toLowerCase().includes("oil") ? "Oil Filter" : "Fuel Filter";
      } else if (productName.toLowerCase().includes("silencer") || productName.toLowerCase().includes("exhaust")) {
        assemblyGroupName = "Exhaust System";
        productGroupName = "Silencer & Exhaust Pipes";
      } else if (productName.toLowerCase().includes("headlight") || productName.toLowerCase().includes("lamp")) {
        assemblyGroupName = "Lighting & Electrics";
        productGroupName = "Main Headlights";
      } else if (productName.toLowerCase().includes("boot") || productName.toLowerCase().includes("bellow") || productName.toLowerCase().includes("shaft")) {
        assemblyGroupName = "Drivetrain & Axles";
        productGroupName = "Drive Shaft Boots";
      }

      parts.push({
        brandName,
        name: productName,
        assemblyGroupName,
        productGroupName,
        specs,
        sourceName: this.name,
        numbers,
        crossReferences,
        images,
        prices,
        fitments,
        rawSourceData: art,
      });
    }

    return parts;
  }
}
