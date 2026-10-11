import type { ApiSourceAdapter, IngestPart } from "../types";

export class AutodocAdapter implements ApiSourceAdapter {
  readonly name = "autodoc_feed" as const;
  readonly label = "Autodoc Automotive Aftermarket Technical Feed";

  async fetchParts(): Promise<IngestPart[]> {
    const autodocFeed: IngestPart[] = [
      // 1. Bosch QuietCast Brake Pad Set (0 986 494 124)
      {
        brandName: "BOSCH",
        brandCountry: "DE",
        name: "Bosch QuietCast Premium Ceramic Brake Pad Set",
        nameAr: "فحمات فرامل سيراميك ممتازة من بوش كوايت كاست",
        description: "Bosch QuietCast ceramic brake pads engineered with Molded Shim Technology for ultra-quiet noise suppression and minimal wheel dust in GCC heat.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Brake System": "Akebono / Advics Heavy-Duty",
          "Thickness [mm]": 17.5,
          "Width [mm]": 165.2,
          "Height [mm]": 64.0,
          "Friction Material": "Ceramic Formulation SA210",
          "ECE R90 Certified": "Yes (E9 90R-02A0124/1042)",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "0 986 494 124", type: "AFTERMARKET", brandName: "BOSCH", isPrimary: true },
          { numberRaw: "0986494124", type: "AFTERMARKET", brandName: "BOSCH" },
          { numberRaw: "4047024823145", type: "EAN", brandName: "BOSCH" },
          { numberRaw: "04465-60320", type: "OE", brandName: "Toyota" },
          { numberRaw: "04465-02220", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "P 83 150", brandName: "BREMBO", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "GDB3364", brandName: "TRW", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "04465-60320", brandName: "Toyota", type: "EQUIVALENT", source: "autodoc_feed" },
        ],
        images: [
          {
            url: "/images/parts/bosch_0986494124.webp",
            thumbnailUrl: "/images/parts/bosch_0986494124_thumb.webp",
            isPrimary: true,
            source: "autodoc_feed",
            altText: "Bosch 0 986 494 124 Front Brake Pads",
          },
        ],
        prices: [
          {
            supplier: "Autodoc European Logistics Center",
            cost: 165.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 28,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Land Cruiser",
              generation: "LC300 / LC200",
              yearFrom: 2015,
              yearTo: 2026,
              engine: "3.5L TT / 4.6L V8 / 5.7L V8",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-LC300-35TT",
            },
            source: "autodoc_feed",
            notes: "Verified OE match for Toyota 04465-60320",
          },
          {
            vehicle: {
              make: "Lexus",
              model: "LX 570 / LX 600",
              generation: "URJ201 / VJA310",
              yearFrom: 2016,
              yearTo: 2026,
              engine: "5.7L V8 / 3.5L V6 TT",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "LEX-LX600-VJA",
            },
            source: "autodoc_feed",
          },
        ],
        rawSourceData: { autodocSku: "ATD-BOS-0986494124", supplier: "Bosch Automotive GmbH" },
      },

      // 2. Mann-Filter W 712/75 Oil Filter
      {
        brandName: "MANN-FILTER",
        brandCountry: "DE",
        name: "Mann-Filter Spin-on Oil Filter with Anti-Drain Valve",
        nameAr: "فلتر زيت محرك مان أصلي ألماني W 712/75",
        description: "Premium German spin-on filter with synthetic filter media, delivering 99.5% particle separation for maximum engine longevity.",
        assemblyGroupName: "Filters",
        assemblyGroupNameAr: "الفلاتر",
        productGroupName: "Oil Filter",
        productGroupNameAr: "فلتر زيت المحرك",
        specs: {
          "Filter Type": "Spin-On Filter",
          "Outer Diameter [mm]": 76,
          "Inner Diameter 2 [mm]": 62,
          "Thread Size": "3/4-16 UNF",
          "Height [mm]": 79,
          "Bypass Valve Pressure [bar]": 1.0,
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "W 712/75", type: "AFTERMARKET", brandName: "MANN-FILTER", isPrimary: true },
          { numberRaw: "W71275", type: "AFTERMARKET", brandName: "MANN-FILTER" },
          { numberRaw: "4011558712752", type: "EAN", brandName: "MANN-FILTER" },
          { numberRaw: "90915-YZZD2", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 452 028", brandName: "BOSCH", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "OC 478", brandName: "MAHLE", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "90915-YZZD2", brandName: "Toyota", type: "EQUIVALENT", source: "autodoc_feed" },
        ],
        images: [
          {
            url: "/images/parts/mann_w712_75.webp",
            thumbnailUrl: "/images/parts/mann_w712_75_thumb.webp",
            isPrimary: true,
            source: "autodoc_feed",
            altText: "Mann-Filter W 712/75 Spin-on Oil Filter",
          },
        ],
        prices: [
          {
            supplier: "Autodoc European Logistics Center",
            cost: 32.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 95,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Land Cruiser Prado",
              generation: "J150 / J250",
              yearFrom: 2010,
              yearTo: 2025,
              engine: "4.0L V6 (1GR-FE)",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-PRADO-1GR",
            },
            source: "autodoc_feed",
          },
          {
            vehicle: {
              make: "Toyota",
              model: "Fortuner",
              generation: "AN160",
              yearFrom: 2016,
              yearTo: 2024,
              engine: "2.7L / 4.0L V6",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-FORTUNER-GCC",
            },
            source: "autodoc_feed",
          },
        ],
        rawSourceData: { autodocSku: "ATD-MNF-W71275", supplier: "Mann+Hummel GmbH" },
      },

      // 3. NGK Laser Iridium Spark Plug (ILKAR5E43)
      {
        brandName: "NGK",
        brandCountry: "JP",
        name: "NGK Laser Iridium Long-Life Spark Plug",
        nameAr: "بواجي ليزر إيريديوم من إن جي كيه طويلة العمر ILKAR5E43",
        description: "Laser-welded iridium center electrode tip ensures high durability and greater spark efficiency in forced-induction GCC engines.",
        assemblyGroupName: "Ignition & Glow",
        assemblyGroupNameAr: "نظام الإشعال والشمعات",
        productGroupName: "Spark Plugs",
        productGroupNameAr: "شمعات الإشعال (البواجي)",
        specs: {
          "Electrode Material": "Iridium Center / Platinum Ground",
          "Thread Diameter [mm]": 12,
          "Thread Reach [mm]": 26.5,
          "Hex Spanner Size [mm]": 14,
          "Electrode Gap [mm]": 1.1,
          "Heat Range": 5,
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "ILKAR5E43", type: "AFTERMARKET", brandName: "NGK", isPrimary: true },
          { numberRaw: "94124", type: "AFTERMARKET", brandName: "NGK" },
          { numberRaw: "087295941248", type: "EAN", brandName: "NGK" },
          { numberRaw: "90919-01253", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "IXEH20TT", brandName: "DENSO", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "0 242 135 528", brandName: "BOSCH", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "90919-01253", brandName: "Toyota", type: "EQUIVALENT", source: "autodoc_feed" },
        ],
        images: [
          {
            url: "/images/parts/ngk_ilkar5e43.webp",
            thumbnailUrl: "/images/parts/ngk_ilkar5e43_thumb.webp",
            isPrimary: true,
            source: "autodoc_feed",
            altText: "NGK Laser Iridium Spark Plug ILKAR5E43",
          },
        ],
        prices: [
          {
            supplier: "Autodoc European Logistics Center",
            cost: 45.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 120,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Camry",
              generation: "XV70",
              yearFrom: 2018,
              yearTo: 2024,
              engine: "2.5L 4-Cyl (A25A-FKS) & 3.5L V6",
              fuel: "Petrol",
              body: "Sedan",
              marketSpec: "GCC",
              externalVehicleId: "TOY-CAMRY-XV70",
            },
            source: "autodoc_feed",
          },
          {
            vehicle: {
              make: "Toyota",
              model: "RAV4",
              generation: "XA50",
              yearFrom: 2019,
              yearTo: 2025,
              engine: "2.5L Dynamic Force",
              fuel: "Petrol / Hybrid",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-RAV4-XA50",
            },
            source: "autodoc_feed",
          },
        ],
        rawSourceData: { autodocSku: "ATD-NGK-94124", supplier: "Niterra Co., Ltd." },
      },

      // 4. KYB Excel-G Gas Shock Absorber (343 315)
      {
        brandName: "KYB",
        brandCountry: "JP",
        name: "KYB Excel-G Twin-Tube Gas Shock Absorber",
        nameAr: "مساعدات غاز كايابا إكسل-جي خلفية 343 315",
        description: "Twin-tube gas-charged shock absorber restoring OE performance and damping control across rugged UAE topography.",
        assemblyGroupName: "Suspension & Damping",
        assemblyGroupNameAr: "نظام التعليق والمساعدات",
        productGroupName: "Shock Absorbers",
        productGroupNameAr: "مساعدات التعليق",
        specs: {
          "Fitting Position": "Rear Axle",
          "Shock Absorber Type": "Gas Pressure Twin-Tube",
          "Mounting Type": "Bottom eye, Top pin",
          "Piston Rod Diameter [mm]": 12.5,
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "343 315", type: "AFTERMARKET", brandName: "KYB", isPrimary: true },
          { numberRaw: "343315", type: "AFTERMARKET", brandName: "KYB" },
          { numberRaw: "4909500587214", type: "EAN", brandName: "KYB" },
          { numberRaw: "48530-69445", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "19-145547", brandName: "BILSTEIN", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "313 038", brandName: "SACHS", type: "EQUIVALENT", source: "autodoc_feed" },
          { targetNumberRaw: "48530-69445", brandName: "Toyota", type: "EQUIVALENT", source: "autodoc_feed" },
        ],
        images: [
          {
            url: "/images/parts/kyb_343315.webp",
            thumbnailUrl: "/images/parts/kyb_343315_thumb.webp",
            isPrimary: true,
            source: "autodoc_feed",
            altText: "KYB 343 315 Excel-G Gas Shock Absorber",
          },
        ],
        prices: [
          {
            supplier: "Autodoc European Logistics Center",
            cost: 180.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 24,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Toyota",
              model: "Land Cruiser Prado",
              generation: "J120 / J150",
              yearFrom: 2003,
              yearTo: 2024,
              engine: "2.7L / 3.0L / 4.0L V6",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-PRADO-1GR",
            },
            source: "autodoc_feed",
          },
        ],
        rawSourceData: { autodocSku: "ATD-KYB-343315", supplier: "KYB Europe GmbH" },
      },
    ];

    return autodocFeed;
  }
}
