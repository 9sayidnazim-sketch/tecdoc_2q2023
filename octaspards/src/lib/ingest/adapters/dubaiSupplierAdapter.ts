import type { ApiSourceAdapter, IngestPart } from "../types";

export class DubaiSupplierAdapter implements ApiSourceAdapter {
  readonly name = "dubai_central_parts" as const;
  readonly label = "UAE Dubai & Sharjah Regional Distributor Network";

  async fetchParts(): Promise<IngestPart[]> {
    const supplierFeed: IngestPart[] = [
      // 1. Toyota Land Cruiser 300 Front Pads - Local Dubai Warehouse Stock
      {
        brandName: "Toyota Genuine Parts",
        brandCountry: "JP",
        name: "Toyota Genuine Front Brake Pad Kit (Land Cruiser 300 / Lexus LX600)",
        nameAr: "فحمات فرامل أمامية أصلية وكالة تويوتا لاندكروزر 300 - مخزن دبي",
        description: "Direct OEM warehouse stock from Al-Quoz Dubai central distribution with 100% genuine hologram authenticity label.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Thickness [mm]": 17.5,
          "Width [mm]": 165.2,
          "Country of Origin": "Japan (Toyota Motor Corp)",
          "UAE Warranty": "6 Months / 10,000 KM Genuine Warranty",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "04465-60320", type: "OE", brandName: "Toyota", isPrimary: true },
          { numberRaw: "0446560320", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 494 124", brandName: "BOSCH", type: "EQUIVALENT", source: "dubai_central_parts" },
          { targetNumberRaw: "P 83 150", brandName: "BREMBO", type: "EQUIVALENT", source: "dubai_central_parts" },
        ],
        images: [
          {
            url: "/images/parts/toyota_04465_60320.webp",
            thumbnailUrl: "/images/parts/toyota_04465_60320_thumb.webp",
            isPrimary: true,
            source: "dubai_central_parts",
            altText: "Toyota 04465-60320 Dubai Warehouse Stock",
          },
        ],
        prices: [
          {
            supplier: "Al-Quoz Dubai Central Warehouse (Hub 1)",
            cost: 285.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5", // 285 * 1.20 * 1.05 = AED 359.10
            stockStatus: "IN_STOCK",
            stockQuantity: 48,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Land Cruiser",
              generation: "LC300",
              yearFrom: 2021,
              yearTo: 2026,
              engine: "3.5L V6 Twin-Turbo (V35A-FTS)",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-LC300-35TT",
            },
            source: "dubai_central_parts",
            notes: "Local GCC Spec Tested",
          },
        ],
        rawSourceData: { warehouseCode: "DXB-WH1-BIN-A42", supplierInv: "INV-2026-DXB-9981" },
      },

      // 2. Bosch QuietCast Pads - Local Warehouse Stock
      {
        brandName: "BOSCH",
        brandCountry: "DE",
        name: "Bosch QuietCast Front Brake Pads (Land Cruiser / LX)",
        nameAr: "فحمات بوش كوايت كاست أمامية سيراميك - تسليم فوري في الإمارات",
        description: "In-stock Bosch Middle East official inventory with anti-squeal rubber-core shims.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Thickness [mm]": 17.5,
          "Width [mm]": 165.2,
          "UAE Delivery": "Same-day Dubai / 24h Abu Dhabi & Northern Emirates",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "0 986 494 124", type: "AFTERMARKET", brandName: "BOSCH", isPrimary: true },
          { numberRaw: "04465-60320", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "04465-60320", brandName: "Toyota", type: "EQUIVALENT", source: "dubai_central_parts" },
        ],
        images: [
          {
            url: "/images/parts/bosch_0986494124.webp",
            thumbnailUrl: "/images/parts/bosch_0986494124_thumb.webp",
            isPrimary: true,
            source: "dubai_central_parts",
            altText: "Bosch QuietCast Dubai Stock",
          },
        ],
        prices: [
          {
            supplier: "Sharjah Industrial Area 4 Hub",
            cost: 155.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5", // 155 * 1.20 * 1.05 = AED 195.30
            stockStatus: "IN_STOCK",
            stockQuantity: 36,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Land Cruiser",
              generation: "LC300",
              yearFrom: 2021,
              yearTo: 2026,
              engine: "3.5L V6 Twin-Turbo",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-LC300-35TT",
            },
            source: "dubai_central_parts",
          },
        ],
        rawSourceData: { warehouseCode: "SHJ-WH4-BIN-112", supplierInv: "INV-2026-SHJ-4412" },
      },

      // 3. Toyota Genuine 04465-02220 (Corolla / Yaris UAE Taxi & Fleet)
      {
        brandName: "Toyota Genuine Parts",
        brandCountry: "JP",
        name: "Toyota Genuine Front Brake Pad Set (Corolla / Yaris)",
        nameAr: "فحمات فرامل أمامية أصلية لتويوتا كورولا وياريس",
        description: "Official OEM brake pad set for Toyota Corolla 1.6L/1.8L/2.0L and Yaris in UAE fleet and private use.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Thickness [mm]": 17.0,
          "Width [mm]": 133.0,
          "Height [mm]": 53.5,
          "Country of Origin": "Japan",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "04465-02220", type: "OE", brandName: "Toyota", isPrimary: true },
          { numberRaw: "0446502220", type: "OE", brandName: "Toyota" },
          { numberRaw: "04465-12610", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 494 220", brandName: "BOSCH", type: "EQUIVALENT", source: "dubai_central_parts" },
          { targetNumberRaw: "P 83 082", brandName: "BREMBO", type: "EQUIVALENT", source: "dubai_central_parts" },
        ],
        images: [
          {
            url: "/images/parts/toyota_04465_02220.webp",
            thumbnailUrl: "/images/parts/toyota_04465_02220_thumb.webp",
            isPrimary: true,
            source: "dubai_central_parts",
            altText: "Toyota Genuine 04465-02220 Corolla Brake Pads",
          },
        ],
        prices: [
          {
            supplier: "Al-Aweer Central Auto Parts Depot",
            cost: 145.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 110,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Corolla",
              generation: "E170 / E210",
              yearFrom: 2014,
              yearTo: 2024,
              engine: "1.6L / 1.8L / 2.0L",
              fuel: "Petrol",
              body: "Sedan",
              marketSpec: "GCC",
              externalVehicleId: "TOY-COROLLA-E210",
            },
            source: "dubai_central_parts",
          },
          {
            vehicle: {
              make: "Toyota",
              model: "Yaris",
              generation: "XP150",
              yearFrom: 2014,
              yearTo: 2023,
              engine: "1.3L / 1.5L",
              fuel: "Petrol",
              body: "Sedan",
              marketSpec: "GCC",
              externalVehicleId: "TOY-YARIS-XP150",
            },
            source: "dubai_central_parts",
          },
        ],
        rawSourceData: { warehouseCode: "AWR-DEPOT-02220", supplierInv: "INV-2026-AWR-1029" },
      },
    ];

    return supplierFeed;
  }
}
