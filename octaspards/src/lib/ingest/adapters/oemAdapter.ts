import type { ApiSourceAdapter, IngestPart } from "../types";

export class OemAdapter implements ApiSourceAdapter {
  readonly name = "oem_epc" as const;
  readonly label = "Official OEM Electronic Parts Catalogues (EPC)";

  async fetchParts(): Promise<IngestPart[]> {
    const oemFeed: IngestPart[] = [
      // 1. Toyota / Lexus Genuine Parts (Top volume in UAE/GCC)
      {
        brandName: "Toyota Genuine Parts",
        brandCountry: "JP",
        name: "Front Disc Brake Pad Set (Land Cruiser 300 / LX600)",
        nameAr: "فحمات فرامل أمامية أصلية لتويوتا لاندكروزر 300 ولزكزس LX600",
        description: "Genuine OEM Toyota ceramic-metallic heavy-duty brake pad set engineered for GCC high-temperature operations.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Brake System": "Advics Heavy Duty 4-Piston",
          "Thickness [mm]": 17.5,
          "Width [mm]": 165.2,
          "Height [mm]": 64.0,
          "Wear Warning": "Integrated acoustic wear sensor clip",
          "Country of Origin": "Japan (OEM Genuine)",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "04465-60320", type: "OE", brandName: "Toyota", isPrimary: true },
          { numberRaw: "04465-60340", type: "OE", brandName: "Lexus" },
          { numberRaw: "04465-60360", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 494 124", brandName: "BOSCH", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "P 83 150", brandName: "BREMBO", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "DB1944", brandName: "BENDIX", type: "EQUIVALENT", source: "oem_epc" },
        ],
        images: [
          {
            url: "/images/parts/toyota_04465_60320.webp",
            thumbnailUrl: "/images/parts/toyota_04465_60320_thumb.webp",
            isPrimary: true,
            source: "oem_epc",
            altText: "Toyota Genuine 04465-60320 Front Brake Pads",
          },
        ],
        prices: [
          {
            supplier: "Al-Futtaim Motors OEM Distribution",
            cost: 295.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 42,
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
            source: "oem_epc",
            notes: "GCC Spec Tropicalized Cooling",
          },
          {
            vehicle: {
              make: "Lexus",
              model: "LX 600",
              generation: "VJA310",
              yearFrom: 2022,
              yearTo: 2026,
              engine: "3.5L V6 Twin-Turbo",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "LEX-LX600-VJA",
            },
            source: "oem_epc",
            notes: "Adaptive Variable Suspension Models",
          },
        ],
        rawSourceData: { epcCatalog: "Toyota Global Microcat", partRef: "04465-60320" },
      },

      // 2. Toyota Genuine Spin-On Oil Filter
      {
        brandName: "Toyota Genuine Parts",
        brandCountry: "JP",
        name: "Spin-On Heavy-Duty Engine Oil Filter",
        nameAr: "فلتر زيت محرك أصلي لتويوتا ولكزس",
        description: "High-efficiency micro-pleated oil filter with silicone anti-drainback valve designed for dusty GCC desert conditions.",
        assemblyGroupName: "Filters",
        assemblyGroupNameAr: "الفلاتر",
        productGroupName: "Oil Filter",
        productGroupNameAr: "فلتر زيت المحرك",
        specs: {
          "Filter Type": "Spin-On Cannister",
          "Thread Size": "3/4-16 UNF",
          "Outer Diameter [mm]": 76,
          "Height [mm]": 88,
          "Bypass Valve Opening Pressure [bar]": 1.0,
          "Anti-Drainback Valve": "Yes (Silicone)",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "90915-YZZD2", type: "OE", brandName: "Toyota", isPrimary: true },
          { numberRaw: "90915-YZZD4", type: "OE", brandName: "Toyota" },
          { numberRaw: "90915-20003", type: "OE", brandName: "Toyota" },
        ],
        crossReferences: [
          { targetNumberRaw: "W 712/75", brandName: "MANN-FILTER", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "0 986 452 028", brandName: "BOSCH", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "OC 478", brandName: "MAHLE", type: "EQUIVALENT", source: "oem_epc" },
        ],
        images: [
          {
            url: "/images/parts/toyota_90915_yzzd2.webp",
            thumbnailUrl: "/images/parts/toyota_90915_yzzd2_thumb.webp",
            isPrimary: true,
            source: "oem_epc",
            altText: "Toyota Genuine Oil Filter 90915-YZZD2",
          },
        ],
        prices: [
          {
            supplier: "Dubai Central Auto Parts OEM Hub",
            cost: 28.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 180,
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
              engine: "4.0L V6 (1GR-FE) / 2.7L (2TR-FE)",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "TOY-PRADO-1GR",
            },
            source: "oem_epc",
          },
          {
            vehicle: {
              make: "Toyota",
              model: "Hilux",
              generation: "AN120",
              yearFrom: 2015,
              yearTo: 2025,
              engine: "2.7L Petrol / 4.0L V6",
              fuel: "Petrol",
              body: "Pickup",
              marketSpec: "GCC",
              externalVehicleId: "TOY-HILUX-GCC",
            },
            source: "oem_epc",
          },
        ],
        rawSourceData: { epcCatalog: "Toyota Global Microcat", partRef: "90915-YZZD2" },
      },

      // 3. Nissan Genuine Parts (Patrol Y62 - UAE Icon)
      {
        brandName: "Nissan Genuine Parts",
        brandCountry: "JP",
        name: "Front Ceramic Brake Pad Set (Nissan Patrol Y62 / Infiniti QX80)",
        nameAr: "طقم فحمات فرامل أمامية أصلي لنيسان باترول بطل الدروب Y62 وإنفينيتي QX80",
        description: "OEM Nissan ceramic disc brake pad set designed specifically for the heavy Patrol V8 chassis in desert and highway UAE driving.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Brake System": "Akebono 4-Piston Heavy Duty",
          "Thickness [mm]": 18.0,
          "Width [mm]": 172.0,
          "Height [mm]": 68.5,
          "Wear Indicator": "Acoustic wear clips included",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "D1060-1KA1A", type: "OE", brandName: "Nissan", isPrimary: true },
          { numberRaw: "D1060-5ZW0A", type: "OE", brandName: "Nissan" },
          { numberRaw: "D1060-4BA0A", type: "OE", brandName: "Infiniti" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 494 512", brandName: "BOSCH", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "P 56 098", brandName: "BREMBO", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "AN-768WK", brandName: "AKEBONO", type: "EQUIVALENT", source: "oem_epc" },
        ],
        images: [
          {
            url: "/images/parts/nissan_d1060_1ka1a.webp",
            thumbnailUrl: "/images/parts/nissan_d1060_1ka1a_thumb.webp",
            isPrimary: true,
            source: "oem_epc",
            altText: "Nissan Genuine Patrol Y62 Brake Pads",
          },
        ],
        prices: [
          {
            supplier: "AW Rostamani Genuine Spare Parts Hub",
            cost: 260.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 55,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Nissan",
              model: "Patrol",
              generation: "Y62",
              yearFrom: 2010,
              yearTo: 2025,
              engine: "5.6L V8 (VK56VD / VK56DE) & 4.0L V6",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "NIS-PATROL-Y62-V8",
            },
            source: "oem_epc",
            notes: "All UAE trims including Nismo and Desert Edition",
          },
          {
            vehicle: {
              make: "Infiniti",
              model: "QX80",
              generation: "Z62",
              yearFrom: 2013,
              yearTo: 2024,
              engine: "5.6L V8 (VK56VD)",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "INF-QX80-56",
            },
            source: "oem_epc",
          },
        ],
        rawSourceData: { epcCatalog: "Nissan FAST / Microcat", partRef: "D1060-1KA1A" },
      },

      // 4. BMW Genuine Parts
      {
        brandName: "BMW Genuine Parts",
        brandCountry: "DE",
        name: "BMW TwinPower Turbo Engine Oil Filter Kit",
        nameAr: "فلتر زيت محرك أصلي لبي إم دبليو الفئة الثالثة والخامسة وX5",
        description: "Genuine BMW engine oil filter element kit with rubber O-ring seal and copper sump drain washer.",
        assemblyGroupName: "Filters",
        assemblyGroupNameAr: "الفلاتر",
        productGroupName: "Oil Filter",
        productGroupNameAr: "فلتر زيت المحرك",
        specs: {
          "Filter Type": "Cartridge Element",
          "Outer Diameter [mm]": 53,
          "Inner Diameter [mm]": 20,
          "Height [mm]": 134,
          "Includes": "Viton O-Ring + Copper Crush Washer",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "11 42 7 566 327", type: "OE", brandName: "BMW", isPrimary: true },
          { numberRaw: "11 42 8 507 683", type: "OE", brandName: "BMW" },
          { numberRaw: "11 42 7 541 827", type: "OE", brandName: "BMW" },
        ],
        crossReferences: [
          { targetNumberRaw: "HU 816 x", brandName: "MANN-FILTER", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "OX 387D", brandName: "MAHLE", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "F 026 407 015", brandName: "BOSCH", type: "EQUIVALENT", source: "oem_epc" },
        ],
        images: [
          {
            url: "/images/parts/bmw_11427566327.webp",
            thumbnailUrl: "/images/parts/bmw_11427566327_thumb.webp",
            isPrimary: true,
            source: "oem_epc",
            altText: "BMW Genuine 11 42 7 566 327 Oil Filter Element",
          },
        ],
        prices: [
          {
            supplier: "AGMC / Gargash Premium Parts Logistics",
            cost: 58.0,
            currency: "AED",
            marginRule: "MARGIN_25_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 65,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "BMW",
              model: "3 Series",
              generation: "E90 / F30 / G20",
              yearFrom: 2006,
              yearTo: 2024,
              engine: "N52 / N54 / N55 / B58 (325i, 330i, 335i, 340i)",
              fuel: "Petrol",
              body: "Sedan / Coupe",
              marketSpec: "GCC",
              externalVehicleId: "BMW-3SERIES-6CYL",
            },
            source: "oem_epc",
          },
          {
            vehicle: {
              make: "BMW",
              model: "X5",
              generation: "E70 / F15 / G05",
              yearFrom: 2007,
              yearTo: 2024,
              engine: "xDrive30i, xDrive35i, xDrive40i",
              fuel: "Petrol",
              body: "SUV",
              marketSpec: "GCC",
              externalVehicleId: "BMW-X5-35I",
            },
            source: "oem_epc",
          },
        ],
        rawSourceData: { epcCatalog: "BMW ETK Web", partRef: "11 42 7 566 327" },
      },

      // 5. Mercedes-Benz Genuine Parts
      {
        brandName: "Mercedes-Benz Genuine Parts",
        brandCountry: "DE",
        name: "Mercedes-Benz Front Low-Dust Brake Pad Set",
        nameAr: "فحمات فرامل أمامية أصلية لمرسيدس-بنز الفئة C والفئة E",
        description: "Official Mercedes-Benz factory brake pads featuring low-dust friction compound and chamfered edges for quiet braking.",
        assemblyGroupName: "Braking System",
        assemblyGroupNameAr: "نظام الفرامل",
        productGroupName: "Brake Pads",
        productGroupNameAr: "فحمات الفرامل",
        specs: {
          "Fitting Position": "Front Axle",
          "Thickness [mm]": 19.4,
          "Width [mm]": 144.0,
          "Height [mm]": 71.5,
          "Sensor Contact": "Prepared for wear indicator cable",
        },
        sourceName: this.name,
        numbers: [
          { numberRaw: "A 000 420 59 00", type: "OE", brandName: "Mercedes-Benz", isPrimary: true },
          { numberRaw: "A 006 420 06 20", type: "OE", brandName: "Mercedes-Benz" },
          { numberRaw: "000 420 59 00", type: "OE", brandName: "Mercedes-Benz" },
        ],
        crossReferences: [
          { targetNumberRaw: "0 986 494 430", brandName: "BOSCH", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "P 50 093", brandName: "BREMBO", type: "EQUIVALENT", source: "oem_epc" },
          { targetNumberRaw: "GDB1815", brandName: "TRW", type: "EQUIVALENT", source: "oem_epc" },
        ],
        images: [
          {
            url: "/images/parts/mb_a0004205900.webp",
            thumbnailUrl: "/images/parts/mb_a0004205900_thumb.webp",
            isPrimary: true,
            source: "oem_epc",
            altText: "Mercedes-Benz Genuine A0004205900 Brake Pads",
          },
        ],
        prices: [
          {
            supplier: "Gargash Enterprises UAE Distribution",
            cost: 320.0,
            currency: "AED",
            marginRule: "MARGIN_20_PLUS_VAT_5",
            stockStatus: "IN_STOCK",
            stockQuantity: 30,
          },
        ],
        fitments: [
          {
            vehicle: {
              make: "Mercedes-Benz",
              model: "C-Class",
              generation: "W205",
              yearFrom: 2014,
              yearTo: 2021,
              engine: "C 200, C 250, C 300 (M274)",
              fuel: "Petrol",
              body: "Sedan",
              marketSpec: "GCC",
              externalVehicleId: "MB-W205-C300",
            },
            source: "oem_epc",
          },
          {
            vehicle: {
              make: "Mercedes-Benz",
              model: "E-Class",
              generation: "W213",
              yearFrom: 2016,
              yearTo: 2023,
              engine: "E 200, E 250, E 300",
              fuel: "Petrol",
              body: "Sedan",
              marketSpec: "GCC",
              externalVehicleId: "MB-W213-E300",
            },
            source: "oem_epc",
          },
        ],
        rawSourceData: { epcCatalog: "Mercedes-Benz PartsInfo Web", partRef: "A 000 420 59 00" },
      },
    ];

    return oemFeed;
  }
}
