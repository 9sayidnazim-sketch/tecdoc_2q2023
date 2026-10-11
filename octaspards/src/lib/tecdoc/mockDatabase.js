// TecDoc 2Q 2023 Mock Engine & Authentic Dataset
// Provides realistic TecDoc 2Q 2023 tables and realistic query evaluation in English

export const MANUFACTURERS = [
  { MFA_ID: 16, MFA_BRAND: 'BMW', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'DE' },
  { MFA_ID: 74, MFA_BRAND: 'MERCEDES-BENZ', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'DE' },
  { MFA_ID: 5, MFA_BRAND: 'AUDI', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'DE' },
  { MFA_ID: 121, MFA_BRAND: 'VOLKSWAGEN', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'DE' },
  { MFA_ID: 92, MFA_BRAND: 'PORSCHE', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'DE' },
  { MFA_ID: 111, MFA_BRAND: 'TOYOTA', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'JP' },
  { MFA_ID: 120, MFA_BRAND: 'VOLVO', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'SE' },
  { MFA_ID: 36, MFA_BRAND: 'FORD', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'US' },
  { MFA_ID: 84, MFA_BRAND: 'OPEL', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'DE' },
  { MFA_ID: 93, MFA_BRAND: 'RENAULT', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'FR' },
  { MFA_ID: 88, MFA_BRAND: 'PEUGEOT', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'FR' },
  { MFA_ID: 106, MFA_BRAND: 'SKODA', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'CZ' },
  { MFA_ID: 104, MFA_BRAND: 'SEAT', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'ES' },
  { MFA_ID: 46, MFA_BRAND: 'HONDA', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'JP' },
  { MFA_ID: 48, MFA_BRAND: 'HYUNDAI', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'KR' },
  { MFA_ID: 58, MFA_BRAND: 'KIA', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'KR' },
  { MFA_ID: 78, MFA_BRAND: 'NISSAN', MFA_PC: 1, MFA_CV: 1, COUNTRY: 'JP' },
  { MFA_ID: 69, MFA_BRAND: 'MAZDA', MFA_PC: 1, MFA_CV: 0, COUNTRY: 'JP' }
];

export const MODELS_SERIES = [
  { MS_ID: 5877, MS_MFA_ID: 16, MS_NAME: '1 Coupe (E82)', YEAR_FROM: 2007, YEAR_TO: 2013 },
  { MS_ID: 5876, MS_MFA_ID: 16, MS_NAME: '1 Convertible (E88)', YEAR_FROM: 2008, YEAR_TO: 2013 },
  { MS_ID: 5040, MS_MFA_ID: 16, MS_NAME: '3 (E90)', YEAR_FROM: 2004, YEAR_TO: 2011 },
  { MS_ID: 5500, MS_MFA_ID: 16, MS_NAME: '3 Touring (E91)', YEAR_FROM: 2005, YEAR_TO: 2012 },
  { MS_ID: 5501, MS_MFA_ID: 16, MS_NAME: '3 Coupe (E92)', YEAR_FROM: 2006, YEAR_TO: 2013 },
  { MS_ID: 7990, MS_MFA_ID: 16, MS_NAME: '5 (F10)', YEAR_FROM: 2009, YEAR_TO: 2016 },
  { MS_ID: 5801, MS_MFA_ID: 16, MS_NAME: 'X5 (E70)', YEAR_FROM: 2006, YEAR_TO: 2013 },
  { MS_ID: 6310, MS_MFA_ID: 74, MS_NAME: 'C-CLASS (W204)', YEAR_FROM: 2007, YEAR_TO: 2014 },
  { MS_ID: 8011, MS_MFA_ID: 74, MS_NAME: 'E-CLASS (W212)', YEAR_FROM: 2009, YEAR_TO: 2016 },
  { MS_ID: 5376, MS_MFA_ID: 5, MS_NAME: 'A4 B7 (8EC)', YEAR_FROM: 2004, YEAR_TO: 2008 },
  { MS_ID: 5890, MS_MFA_ID: 5, MS_NAME: 'A4 B8 (8K2)', YEAR_FROM: 2007, YEAR_TO: 2015 },
  { MS_ID: 6712, MS_MFA_ID: 121, MS_NAME: 'GOLF VII (5G1, BQ1, BE1, BE2)', YEAR_FROM: 2012, YEAR_TO: 2021 }
];

export const PASSENGER_CARS = [
  {
    PC_ID: 9877,
    PC_MFA_ID: 16,
    PC_MS_ID: 5877,
    PC_MODEL_DES: 'M',
    ENG_CODE: 'N54 B30 A',
    PCS_POWER_KW: 250,
    PCS_POWER_PS: 340,
    PCS_CAPACITY_TAX: 2979,
    PCS_CAPACITY_TECH: 2979,
    PCS_CONSTRUCTION_INTERVAL_START: '2011-04',
    PCS_CONSTRUCTION_INTERVAL_END: '2012-06',
    PCS_BODY_TYPE: 'Coupe',
    PCS_FUEL_TYPE: 'Petrol',
    PCS_DRIVE_TYPE: 'Rear Wheel Drive',
    PCS_VALVES: 24,
    PCS_CYLINDERS: 6,
    KBA_NUM: '0005/AZC'
  },
  {
    PC_ID: 23112,
    PC_MFA_ID: 16,
    PC_MS_ID: 5877,
    PC_MODEL_DES: '135 i',
    ENG_CODE: 'N55 B30 A',
    PCS_POWER_KW: 225,
    PCS_POWER_PS: 306,
    PCS_CAPACITY_TAX: 2979,
    PCS_CAPACITY_TECH: 2979,
    PCS_CONSTRUCTION_INTERVAL_START: '2007-10',
    PCS_CONSTRUCTION_INTERVAL_END: '2013-10',
    PCS_BODY_TYPE: 'Coupe',
    PCS_FUEL_TYPE: 'Petrol',
    PCS_DRIVE_TYPE: 'Rear Wheel Drive',
    PCS_VALVES: 24,
    PCS_CYLINDERS: 6,
    KBA_NUM: '0005/AJT'
  },
  {
    PC_ID: 23111,
    PC_MFA_ID: 16,
    PC_MS_ID: 5877,
    PC_MODEL_DES: '120 d',
    ENG_CODE: 'N47 D20 A / N47 D20 C',
    PCS_POWER_KW: 130,
    PCS_POWER_PS: 177,
    PCS_CAPACITY_TAX: 1995,
    PCS_CAPACITY_TECH: 1995,
    PCS_CONSTRUCTION_INTERVAL_START: '2007-09',
    PCS_CONSTRUCTION_INTERVAL_END: '2013-10',
    PCS_BODY_TYPE: 'Coupe',
    PCS_FUEL_TYPE: 'Diesel',
    PCS_DRIVE_TYPE: 'Rear Wheel Drive',
    PCS_VALVES: 16,
    PCS_CYLINDERS: 4,
    KBA_NUM: '0005/AJS'
  },
  {
    PC_ID: 55432,
    PC_MFA_ID: 121,
    PC_MS_ID: 6712,
    PC_MODEL_DES: '2.0 TDI',
    ENG_CODE: 'CRBC, CRLB, CRMB',
    PCS_POWER_KW: 110,
    PCS_POWER_PS: 150,
    PCS_CAPACITY_TAX: 1968,
    PCS_CAPACITY_TECH: 1968,
    PCS_CONSTRUCTION_INTERVAL_START: '2012-11',
    PCS_CONSTRUCTION_INTERVAL_END: '2020-03',
    PCS_BODY_TYPE: 'Hatchback',
    PCS_FUEL_TYPE: 'Diesel',
    PCS_DRIVE_TYPE: 'Front Wheel Drive',
    PCS_VALVES: 16,
    PCS_CYLINDERS: 4,
    KBA_NUM: '0603/BPP'
  },
  {
    PC_ID: 18371,
    PC_MFA_ID: 5,
    PC_MS_ID: 5376,
    PC_MODEL_DES: '2.0 TFSI quattro',
    ENG_CODE: 'BGB / BWE',
    PCS_POWER_KW: 147,
    PCS_POWER_PS: 200,
    PCS_CAPACITY_TAX: 1984,
    PCS_CAPACITY_TECH: 1984,
    PCS_CONSTRUCTION_INTERVAL_START: '2004-11',
    PCS_CONSTRUCTION_INTERVAL_END: '2008-06',
    PCS_BODY_TYPE: 'Saloon / Sedan',
    PCS_FUEL_TYPE: 'Petrol',
    PCS_DRIVE_TYPE: 'All-wheel Drive (quattro)',
    PCS_VALVES: 16,
    PCS_CYLINDERS: 4,
    KBA_NUM: '0588/864'
  }
];

// TecDoc 2018 Multi-Vehicle Types
export const COMMERCIAL_VEHICLES = [
  {
    CV_ID: 10420,
    CV_MFA_ID: 74,
    CV_MODEL_DES: 'Actros MP4 1845 LS',
    ENG_CODE: 'OM 471 LA.6-1',
    POWER_KW: 330,
    POWER_PS: 449,
    TONNAGE: '18.0 t',
    INTERVAL: '2011 - Present',
    AXLE_CONFIG: '4x2'
  },
  {
    CV_ID: 10421,
    CV_MFA_ID: 120,
    CV_MODEL_DES: 'FH 16 750 Globetrotter XL',
    ENG_CODE: 'D16K750',
    POWER_KW: 552,
    POWER_PS: 750,
    TONNAGE: '26.0 t',
    INTERVAL: '2014 - Present',
    AXLE_CONFIG: '6x4'
  },
  {
    CV_ID: 10422,
    CV_MFA_ID: 88,
    CV_MODEL_DES: 'TGX 18.510 EfficientLine 3',
    ENG_CODE: 'D2676 LF78',
    POWER_KW: 375,
    POWER_PS: 510,
    TONNAGE: '18.0 t',
    INTERVAL: '2019 - Present',
    AXLE_CONFIG: '4x2'
  }
];

export const MOTORBIKES = [
  {
    MB_ID: 20110,
    MB_MFA_ID: 16,
    MB_MODEL_DES: 'R 1250 GS Adventure',
    ENG_CODE: 'A74B12M',
    POWER_KW: 100,
    POWER_PS: 136,
    CAPACITY: 1254,
    INTERVAL: '2018 - Present',
    CATEGORY: 'Dual-sport / Adventure'
  },
  {
    MB_ID: 20111,
    MB_MFA_ID: 46,
    MB_MODEL_DES: 'CBR 1000 RR-R Fireblade SP',
    ENG_CODE: 'SC82E',
    POWER_KW: 160,
    POWER_PS: 217,
    CAPACITY: 999,
    INTERVAL: '2020 - Present',
    CATEGORY: 'Superbike'
  },
  {
    MB_ID: 20112,
    MB_MFA_ID: 69,
    MB_MODEL_DES: 'YZF-R1M Crossplane',
    ENG_CODE: 'N533E',
    POWER_KW: 147,
    POWER_PS: 200,
    CAPACITY: 998,
    INTERVAL: '2015 - Present',
    CATEGORY: 'Supersport'
  }
];

export const ENGINES = [
  {
    ENG_ID: 30101,
    MFA_BRAND: 'DEUTZ',
    SALES_NAME: 'TCD 2012 L06 2V',
    POWER_KW: 155,
    POWER_PS: 211,
    CYLINDERS: 6,
    CAPACITY: 6057,
    APPLICATION: 'Construction & Agricultural Equipment'
  },
  {
    ENG_ID: 30102,
    MFA_BRAND: 'CUMMINS',
    SALES_NAME: 'B6.7 Euro 6D',
    POWER_KW: 224,
    POWER_PS: 305,
    CYLINDERS: 6,
    CAPACITY: 6700,
    APPLICATION: 'Medium-Duty Commercial & Buses'
  },
  {
    ENG_ID: 30103,
    MFA_BRAND: 'CATERPILLAR',
    SALES_NAME: 'C13 ACERT Industrial',
    POWER_KW: 388,
    POWER_PS: 520,
    CYLINDERS: 6,
    CAPACITY: 12500,
    APPLICATION: 'Mining & Heavy Industrial Generators'
  }
];

export const AXLES = [
  {
    AXLE_ID: 40101,
    MFA_BRAND: 'SAF-HOLLAND',
    AXLE_NAME: 'Intradisc Plus Integral B9-22K',
    BRAKE_TYPE: 'Disc Brake 22.5"',
    LOAD_KG: 9000,
    TRACK_MM: 2040,
    APPLICATION: 'Semi-Trailer Rigid Axle'
  },
  {
    AXLE_ID: 40102,
    MFA_BRAND: 'BPW',
    AXLE_NAME: 'ECO Plus 3 SHSF 9010-15',
    BRAKE_TYPE: 'Drum Brake SN 4218',
    LOAD_KG: 9000,
    TRACK_MM: 2095,
    APPLICATION: 'Heavy Commercial Trailer Axle'
  },
  {
    AXLE_ID: 40103,
    MFA_BRAND: 'MERITOR',
    AXLE_NAME: '14X Tandem Drive Axle',
    BRAKE_TYPE: 'Air Disc EX225',
    LOAD_KG: 18140,
    RATIO: '3.42 / 3.55',
    APPLICATION: 'Class 8 Heavy Duty Tractor Tandem'
  }
];

export const TECDOC_2018_SCHEMA_MAP = [
  { table2018: 'manufacturers', table2023: 'MFA_MANUFACTURERS', purpose: 'Vehicle and engine brand master catalog', recordDiff: '2018 used boolean columns; 2023 uses MFA_PC, MFA_CV flags & separate linkage matrices.' },
  { table2018: 'models', table2023: 'MODELS_SERIES', purpose: 'Vehicle model families and construction year intervals', recordDiff: '2018 had textual intervals; 2023 uses integer timestamps YEAR_FROM / YEAR_TO.' },
  { table2018: 'passanger_cars', table2023: 'PASSENGER_CARS', purpose: 'Individual car engine and trim variants (K-Typ)', recordDiff: '2018 denormalized descriptions; 2023 normalizes country and technical criteria into 3NF.' },
  { table2018: 'passanger_car_attributes', table2023: 'ARTICLE_CRITERIA & CRITERIA', purpose: 'Technical criteria parameters (power, displacement)', recordDiff: '2018 used EAV string storage; 2023 uses multilingual get_text() designations.' },
  { table2018: 'passanger_car_trees', table2023: 'SEARCH_TREE & STR_NODES', purpose: 'Hierarchical assembly navigation taxonomy', recordDiff: '2018 relied on recursive self-joins; 2023 uses precomputed STR_LEVEL nodes.' },
  { table2018: 'article_links', table2023: 'LINK_ART & LINK_LA_TYP', purpose: 'Linkage between spare parts and vehicle variants', recordDiff: '2018 linked via raw strings; 2023 uses surrogate ART_ID and LA_ID junction tables.' },
  { table2018: 'article_oe', table2023: 'ARTICLE_CROSS & OE_CROSS_REFERENCES', purpose: 'Original Equipment Manufacturer (OEM) cross references', recordDiff: '2018 stored OENbr as raw strings; 2023 indexes cleaned OEN_SEARCH_NUMBER.' },
  { table2018: 'article_cross', table2023: 'ARTICLE_CROSS (Aftermarket)', purpose: 'Aftermarket competitor interchange equivalents', recordDiff: '2018 required two-hop joins; 2023 supports direct peer-to-peer cross relations.' },
  { table2018: 'article_parts', table2023: 'ARTICLE_PARTS (BOM / Kits)', purpose: 'Constituent bill-of-materials kit components', recordDiff: '2018 stored raw article numbers; 2023 normalizes assembly kits with sub-article IDs.' },
  { table2018: 'article_images', table2023: 'DOCUMENTS & SENSITIVE_COORDINATES', purpose: 'Product photography, PDF technical sheets, blueprints', recordDiff: '2018 stored filename references; 2023 includes SEN_COORD coordinates for hotspots.' },
  { table2018: 'commercial_vehicles', table2023: 'COMMERCIAL_VEHICLES', purpose: 'Commercial trucks, tractor units, and buses master registry', recordDiff: 'Normalized tonnage, gross vehicle weight, and cabin codes into dedicated CV entity.' },
  { table2018: 'cv_axles', table2023: 'CV_AXLES', purpose: 'Drive, steer, and trailing axle configurations', recordDiff: 'Separated tractor drive axles from commercial trailer axles.' },
  { table2018: 'cv_drivers_cabs', table2023: 'CV_DRIVERS_CABS', purpose: 'Cab specifications, sleeper beds, and roof heights', recordDiff: 'Normalized cab height and sleeper configurations into key-value attributes.' },
  { table2018: 'cv_wheelbases', table2023: 'CV_WHEELBASES', purpose: 'Chassis wheelbase and axle spacing intervals', recordDiff: 'Supports multi-axle configurations (4x2, 6x2, 6x4, 8x4).' },
  { table2018: 'cv_suspensions', table2023: 'CV_SUSPENSIONS', purpose: 'Air, leaf, and parabolic suspension types', recordDiff: 'Explicit suspension codes per axle position.' },
  { table2018: 'cv_brakes', table2023: 'CV_BRAKES', purpose: 'Pneumatic, EBS, and disc brake linkage matrices', recordDiff: 'Brake booster and ABS ring integration mapping.' },
  { table2018: 'motorbikes', table2023: 'MOTORBIKES', purpose: 'Motorcycles, scooters, and quad bikes master catalog', recordDiff: 'Dedicated motorcycle entity decoupling 2-wheelers from passenger cars.' },
  { table2018: 'mb_engines', table2023: 'MB_ENGINES', purpose: 'Motorcycle engine configurations and valve counts', recordDiff: 'Indexes 2-stroke, 4-stroke, single, and V-twin layout specs.' },
  { table2018: 'engines', table2023: 'ENGINES', purpose: 'Universal automotive and stationary engine catalog', recordDiff: 'Independent engine entity allowing linkage to cars, marine, and power gensets.' },
  { table2018: 'engine_attributes', table2023: 'ENGINE_CRITERIA', purpose: 'Bore, stroke, power output, compression ratios', recordDiff: 'Normalized engineering criteria with SI unit keys.' },
  { table2018: 'axles', table2023: 'AXLES', purpose: 'Heavy trailer and commercial drive axle catalog (BPW, SAF)', recordDiff: 'Decoupled trailer running gear from motorized tractors.' },
  { table2018: 'axle_types', table2023: 'AXLE_TYPES', purpose: 'Tandem, lift axle, and steering axle classifications', recordDiff: 'Load rating in tons and hub diameter specs.' },
  { table2018: 'axle_brakes', table2023: 'AXLE_BRAKES', purpose: 'Axle brake drum and disc associations', recordDiff: 'Brake chamber stroke and S-cam diameter criteria.' },
  { table2018: 'brands', table2023: 'BRANDS', purpose: 'Supplier brand identities and trade marks (Bosch, Brembo)', recordDiff: 'Normalized supplier IDs with TecAlliance Certified Data Supplier badges.' },
  { table2018: 'brand_addresses', table2023: 'BRAND_ADDRESSES', purpose: 'Supplier contact, postal, and headquarters metadata', recordDiff: 'ISO country codes and localized contact information.' },
  { table2018: 'brand_logos', table2023: 'BRAND_LOGOS', purpose: 'Vector and high-resolution raster brand emblems', recordDiff: 'SVG and PNG CDN paths with dark/light mode variants.' },
  { table2018: 'articles', table2023: 'ARTICLES', purpose: 'Master spare parts article table', recordDiff: 'Surrogate primary key ART_ID replaces composite supplier+number keys.' },
  { table2018: 'article_lookup', table2023: 'ART_LOOKUP', purpose: 'Normalized search key index for article numbers', recordDiff: 'Stripped alphanumeric indexing (ARL_SEARCH_NUMBER) for instantaneous lookups.' },
  { table2018: 'article_attributes', table2023: 'ARTICLE_CRITERIA', purpose: 'Physical, electrical, and mechanical part dimensions', recordDiff: 'Standardized criteria IDs mapped to multilingual text tables.' },
  { table2018: 'article_prices', table2023: 'ARTICLE_PRICES', purpose: 'MSRP, wholesale, and regional trade pricing indexes', recordDiff: 'Multi-currency support with validity timestamps and VAT indicators.' },
  { table2018: 'article_ean', table2023: 'EAN_NUMBERS', purpose: 'European Article Numbers / GTIN barcode directory', recordDiff: 'Indexed EAN-13 barcodes with packaging level multipliers.' },
  { table2018: 'article_status', table2023: 'ARTICLE_STATUS', purpose: 'Production lifecycle states (Normal, Discontinued, Obsolete)', recordDiff: 'Historical lifecycle flags with phase-out date records.' },
  { table2018: 'superseded_articles', table2023: 'SUPERSEDED_ARTICLES', purpose: 'Direct article supersession and replacement chains', recordDiff: 'Directed graph indexing for 1-to-1 and 1-to-many replacement parts.' },
  { table2018: 'superseded_by', table2023: 'SUPERSEDED_BY', purpose: 'Backward replacement and reverse cross lookup', recordDiff: 'Instant resolution of legacy part inquiries to active catalogue parts.' },
  { table2018: 'packaging_units', table2023: 'PACKAGING_UNITS', purpose: 'Master cartons, blisters, and minimum order units', recordDiff: 'Normalized quantity per pack and pallet layer counts.' },
  { table2018: 'article_accessories', table2023: 'ARTICLE_ACCESSORIES', purpose: 'Optional accessories and consumable pairings (Grease, Clamps)', recordDiff: 'Associated installation materials and fitting hardware.' },
  { table2018: 'article_coo', table2023: 'COUNTRY_OF_ORIGIN', purpose: 'ISO country codes for manufacturing provenance', recordDiff: 'Customs declaration support and regional supply chain tracking.' },
  { table2018: 'customs_tariff_codes', table2023: 'CUSTOMS_TARIFF_CODES', purpose: 'Harmonized System (HS) international customs tariff codes', recordDiff: '8-digit and 10-digit HS codes for import/export compliance.' },
  { table2018: 'generic_articles', table2023: 'GENERIC_ARTICLES', purpose: 'Standardized TecDoc product classifications (GenArt)', recordDiff: 'Standard classification codes (e.g. 82 = Brake Disc, 7 = Oil Filter).' },
  { table2018: 'generic_article_criteria', table2023: 'GEN_ART_CRITERIA', purpose: 'Mandatory criteria schemas per product group', recordDiff: 'Strict SA210 validation constraints enforcing required part dimensions.' },
  { table2018: 'generic_article_synonyms', table2023: 'GEN_ART_SYNONYMS', purpose: 'Multilingual search aliases and colloquial terms', recordDiff: 'Keyword aliases mapped to canonical GenArt codes in 29 languages.' },
  { table2018: 'search_trees', table2023: 'SEARCH_TREE', purpose: 'Root catalog taxonomy trees', recordDiff: 'Hierarchical categorization separating Maintenance, Brakes, Engine, Chassis.' },
  { table2018: 'search_tree_nodes', table2023: 'STR_NODES', purpose: 'Intermediate taxonomy branches and groupings', recordDiff: 'Fast tree traversal using materialized node level depth.' },
  { table2018: 'search_tree_designations', table2023: 'STR_DESIGNATIONS', purpose: 'Taxonomy branch localized titles in 29 languages', recordDiff: 'Decoupled language translations ensuring instantaneous locale switching.' },
  { table2018: 'link_search_tree_genart', table2023: 'LINK_STR_GA', purpose: 'Junction binding taxonomy nodes to product categories', recordDiff: 'Allows products to exist in multiple logical catalog tree categories.' },
  { table2018: 'link_art_ga', table2023: 'LINK_ART_GA', purpose: 'Direct junction linking articles to product types', recordDiff: 'Indexed junction table linking articles to standard GenArt categories.' },
  { table2018: 'link_la_typ', table2023: 'LINK_LA_TYP', purpose: 'Article to passenger vehicle variant linkage', recordDiff: 'High-speed fitment matrix with link status and validity intervals.' },
  { table2018: 'link_la_cv', table2023: 'LINK_LA_CV', purpose: 'Article to commercial truck linkage', recordDiff: 'Commercial vehicle fitment linkage with gross weight constraints.' },
  { table2018: 'link_la_mb', table2023: 'LINK_LA_MB', purpose: 'Article to motorcycle linkage', recordDiff: 'Motorcycle linkage with displacement and chassis number constraints.' },
  { table2018: 'link_la_eng', table2023: 'LINK_LA_ENG', purpose: 'Article to stationary and marine engine linkage', recordDiff: 'Direct engine linkage without vehicle chassis intermediate.' },
  { table2018: 'link_la_axle', table2023: 'LINK_LA_AXLE', purpose: 'Article to trailer axle linkage', recordDiff: 'Running gear linkage with drum/disc diameter filters.' },
  { table2018: 'link_la_criteria', table2023: 'LINK_LA_CRITERIA', purpose: 'Application-specific fitment criteria restrictions', recordDiff: 'Fitting position, chassis number restrictions, and transmission filters.' },
  { table2018: 'link_gra_art', table2023: 'LINK_GRA_ART', purpose: 'Graphic blueprint to article linkage', recordDiff: 'Binds exploded schematic diagrams to highlighted spare part callouts.' },
  { table2018: 'documents', table2023: 'DOCUMENTS', purpose: 'Media file registry for PDFs, JPGs, and PNGs', recordDiff: 'Document hash verification, resolution metadata, and mime types.' },
  { table2018: 'document_types', table2023: 'DOC_TYPES', purpose: 'Classification for photo, drawing, manual, safety data', recordDiff: 'Distinct visual types (Product Photo, Technical Drawing, Installation Guide).' },
  { table2018: 'document_urls', table2023: 'DOC_URLS', purpose: 'CDN endpoints and secure storage paths', recordDiff: 'Cloud CDN URL templates with tokenized access signatures.' },
  { table2018: 'sensitive_coordinates', table2023: 'SENSITIVE_COORDINATES', purpose: 'Hotspot bounding box coordinates for diagrams', recordDiff: 'Normalized polygon coordinates (X1, Y1, X2, Y2) for interactive hover states.' },
  { table2018: 'coordinate_types', table2023: 'COORD_TYPES', purpose: 'Callout badges, hotspot pins, circular targets', recordDiff: 'Differentiates circle callouts, rectangular bounds, and leader lines.' },
  { table2018: 'text_modules', table2023: 'TEXT_MODULES', purpose: 'Reusable technical notes and installation warnings', recordDiff: 'Shared service warnings (e.g. Replace stretch bolts upon disassembly).' },
  { table2018: 'text_designations', table2023: 'TEXT_DESIGNATIONS', purpose: 'Normalized multilingual string translation table', recordDiff: 'Central string table for all technical titles in 29 ISO languages.' },
  { table2018: 'languages', table2023: 'LANGUAGES', purpose: 'ISO 639-1 language master registry', recordDiff: 'Supported languages with locale code and script direction (LTR/RTL).' },
  { table2018: 'countries', table2023: 'COUNTRIES', purpose: 'ISO 3166-1 country master registry', recordDiff: 'Country codes with regional market clusters (GCC, EU, NAFTA).' },
  { table2018: 'currencies', table2023: 'CURRENCIES', purpose: 'ISO 4217 trade currencies', recordDiff: 'Active currency definitions with decimal precision and ISO codes.' },
  { table2018: 'units_of_measurement', table2023: 'UNITS_OF_MEASUREMENT', purpose: 'SI unit master (mm, kW, bar, Nm, kg)', recordDiff: 'Standardized physical units with conversion ratios.' },
  { table2018: 'criteria_definitions', table2023: 'CRITERIA', purpose: 'Canonical criteria master table', recordDiff: 'Master list of criteria codes across electrical, mechanical, and dimensions.' },
  { table2018: 'criteria_values', table2023: 'KEY_VALUES', purpose: 'Predefined discrete values for criteria', recordDiff: 'Controlled vocabulary preventing spelling variations in technical attributes.' },
  { table2018: 'criteria_types', table2023: 'CRITERIA_TYPES', purpose: 'Numeric, alphanumeric, and discrete value flags', recordDiff: 'Defines input format and comparison operators for query filters.' },
  { table2018: 'kba_numbers', table2023: 'KBA_NUMBERS', purpose: 'German Federal Motor Transport Authority Typschlüssel', recordDiff: 'Direct lookup from HSN/TSN numbers to TecDoc K-Typ vehicle IDs.' },
  { table2018: 'french_types', table2023: 'FRENCH_TYPES', purpose: 'French National Type National d’Identification (CNIT)', recordDiff: 'Registration document (carte grise) matcher to passenger vehicles.' },
  { table2018: 'swiss_types', table2023: 'SWISS_TYPES', purpose: 'Swiss Typengenehmigung certification codes', recordDiff: 'Swiss vehicle registration number mapper.' },
  { table2018: 'dutch_types', table2023: 'DUTCH_TYPES', purpose: 'Dutch RDW Kenteken vehicle mapping table', recordDiff: 'Dutch license plate registration code to vehicle type linkage.' },
  { table2018: 'austrian_types', table2023: 'AUSTRIAN_TYPES', purpose: 'Austrian NatCode motor vehicle registrations', recordDiff: 'Austrian national vehicle registration matcher.' },
  { table2018: 'italian_types', table2023: 'ITALIAN_TYPES', purpose: 'Italian Codice Ministeriale classification', recordDiff: 'Italian vehicle registration document cross-indexer.' },
  { table2018: 'swedish_types', table2023: 'SWEDISH_TYPES', purpose: 'Swedish Transport Agency Registreringsnummer', recordDiff: 'Swedish license plate to TecDoc K-Typ lookup table.' },
  { table2018: 'vin_patterns', table2023: 'VIN_PATTERNS', purpose: 'WMI and VDS regex patterns for ISO 3779 VIN decoding', recordDiff: 'Regular expression patterns for 17-character VIN character decoding.' },
  { table2018: 'vin_linkages', table2023: 'VIN_LINKAGES', purpose: 'Direct mapping from decoded VIN pattern to K-Typ ID', recordDiff: 'High-confidence vehicle linkage from decoded vehicle identifier.' },
  { table2018: 'supplier_data_versions', table2023: 'SUPPLIER_DATA_VERSIONS', purpose: 'Data format release tags and delivery stamps', recordDiff: 'Audit trail of supplier monthly catalog submissions.' },
  { table2018: 'data_supplier_master', table2023: 'DATA_SUPPLIERS', purpose: 'Registered TecAlliance data provider profiles', recordDiff: 'Supplier certified status, brand codes, and technical contact details.' },
  { table2018: 'quality_assurance_logs', table2023: 'QA_LOGS', purpose: 'Data validation and conformance test audit trail', recordDiff: 'Automated SA rule validation results for catalog submissions.' },
  { table2018: 'change_request_deltas', table2023: 'CR_DELTAS', purpose: 'Quarterly delta changes across major releases', recordDiff: 'Official TecAlliance change requests (CR) tracking schema evolutions.' },
  { table2018: 'table_partition_catalog', table2023: 'TABLE_PARTITIONS', purpose: 'Physical database partition boundaries', recordDiff: 'Partition range definitions for heavy linkage and criteria tables.' },
  { table2018: 'index_utilization_stats', table2023: 'INDEX_STATS', purpose: 'Query planner execution frequency metadata', recordDiff: 'Monitors unused and redundant secondary indexes for performance.' },
  { table2018: 'api_rate_limits', table2023: 'API_RATE_LIMITS', purpose: 'Pegasus 3.0 Web Service client quota rules', recordDiff: 'Tiered API request quotas and endpoint security policies.' },
  { table2018: 'system_version_manifest', table2023: 'VERSION_MANIFEST', purpose: 'TecDoc 2Q 2023 release integrity hash manifest', recordDiff: 'Cryptographic SHA-256 release verification hashes per table partition.' }
];

export const TECDOC_2017_CR_DELTAS = [
  {
    table: 'cr_herst_new',
    domain: 'Manufacturers & Brands',
    operation: 'NEW REGISTRATIONS',
    recordsAdded: 48,
    sampleEntities: 'SISU AUTO, CHANGAN, MTU, JS Asakashi, Motorcraft, Dana Spicer',
    architecturalImpact: 'Added multi-sector vendor IDs into global manufacturer pool; expanded commercial and Asian OEM coverage.'
  },
  {
    table: 'cr_mod_new',
    domain: 'Model Series & Platforms',
    operation: 'NEW RANGE INTERVALS',
    recordsAdded: 164,
    sampleEntities: 'BMW 5 Touring (G31), X3 (G01), Benz E-Class All-Terrain (S213), Audi A8 (D5), VW Arteon',
    architecturalImpact: 'Introduced 2017+ Euro 6d generation chassis codes and modern electronic platform intervals.'
  },
  {
    table: 'cr_fzg_new',
    domain: 'Vehicle Configurations (K-Typ)',
    operation: 'VEHICLE INTRODUCTIONS',
    recordsAdded: 420,
    sampleEntities: '520d xDrive, 530i, E 220 d 4MATIC, 50 TDI Mild Hybrid quattro, Arteon 2.0 TSI',
    architecturalImpact: 'Added 48V mild hybrid (MHEV) powertrain classifications and dual-clutch transmission linkage flags.'
  },
  {
    table: 'cr_mcode_new',
    domain: 'Engine Code Registry',
    operation: 'MOTORCODES ADDITIONS',
    recordsAdded: 96,
    sampleEntities: 'B47 D20 A, B48 B20 B, OM 654.920, DDVC (EA897evo2), DJHC (EA888 Gen 3)',
    architecturalImpact: 'Normalized modular engine family codes across BMW modular B-series, Benz OM654, and VAG EA888/EA897.'
  },
  {
    table: 'cr_genart_cng',
    domain: 'Generic Article Criteria Rules',
    operation: 'MANDATORY TAXONOMY CRITERIA',
    recordsAdded: 72,
    sampleEntities: 'GenArt 82 (Brake Disc), 402 (Shock Absorber), 7 (Oil Filter), 800 (Bellow Kit), 161 (Alternator)',
    architecturalImpact: 'Enforced SA210 and SA400 strict criteria validation rules: suppliers must submit brake thickness and damper mounting.'
  },
  {
    table: 'cr_achse_new',
    domain: 'Trailer & Heavy Drive Axles',
    operation: 'COMMERCIAL AXLE DELTAS',
    recordsAdded: 34,
    sampleEntities: 'Dana Spicer D170 Tandem, S140 Single Rear, SAF-Holland INTRAAX Plus, BPW ECO Plus 3',
    architecturalImpact: 'Dedicated commercial axle taxonomy decoupling heavy truck trailer axles from motor vehicle power units.'
  },
  {
    table: 'cr_fzglndspez_new',
    domain: 'Country-Specific Market Specs',
    operation: 'REGIONAL RESTRICTIONS',
    recordsAdded: 180,
    sampleEntities: 'Euro 6d-TEMP (DE), RHD Headlamp Spec (GB), Long Wheelbase Spec (CN), Cold Climate Package (RU)',
    architecturalImpact: 'Permitted catalog clients to filter parts availability by country ISO restrictions and climate adaptations.'
  }
];

export const ARTICLES = [
  {
    ART_ID: 1878343,
    ART_ARTICLE_NR: '20430',
    ART_SUP_BRAND: 'SPIDAN',
    ART_PRODUCT_NAME: 'Bellow Kit, drive shaft boot',
    ART_STATUS_TEXT: 'Normal',
    EAN: '4019064204301',
    PACKING_UNIT: '1 kit',
    GENERIC_ART_ID: 800,
    CRITERIA: [
      { CRI_NAME: 'Fitting Position', CRI_VALUE: 'Front Axle, Wheel Side' },
      { CRI_NAME: 'Internal Diameter 1 [mm]', CRI_VALUE: '28' },
      { CRI_NAME: 'Internal Diameter 2 [mm]', CRI_VALUE: '86' },
      { CRI_NAME: 'Height [mm]', CRI_VALUE: '148' },
      { CRI_NAME: 'Material', CRI_VALUE: 'Thermoplastic' },
      { CRI_NAME: 'Includes', CRI_VALUE: 'with grease and clamps' }
    ],
    CROSSES: [
      { BRAND: 'BMW (OE)', NUMBER: '31 60 7 565 315', TYPE: 'Original OE' },
      { BRAND: 'BMW (OE)', NUMBER: '31 60 7 565 316', TYPE: 'Original OE' },
      { BRAND: 'LÖBRO', NUMBER: '304560', TYPE: 'Competitor / Aftermarket' },
      { BRAND: 'SKF', NUMBER: 'VKJP 1098', TYPE: 'Competitor / Aftermarket' },
      { BRAND: 'GSP', NUMBER: '780124', TYPE: 'Competitor / Aftermarket' },
      { BRAND: 'FEBI BILSTEIN', NUMBER: '38721', TYPE: 'Competitor / Aftermarket' }
    ],
    FITMENT: [
      { BRAND: 'BMW', MODEL: '1 Coupe (E82) M', YEARS: '2011-2012', KW: 250, HP: 340 },
      { BRAND: 'BMW', MODEL: '1 Coupe (E82) 135 i', YEARS: '2007-2013', KW: 225, HP: 306 },
      { BRAND: 'BMW', MODEL: '3 Coupe (E92) 335 i', YEARS: '2006-2013', KW: 225, HP: 306 },
      { BRAND: 'BMW', MODEL: '3 (E90) 330 d', YEARS: '2005-2011', KW: 170, HP: 231 }
    ],
    ACCESSORIES: [
      { ART_NR: '900215', BRAND: 'SPIDAN', NAME: 'Molybdenum Disulphide MoS2 Grease Tube 90g' },
      { ART_NR: 'CLAMP-85', BRAND: 'SPIDAN', NAME: 'Stainless Steel Ear Clamp 85mm' },
      { ART_NR: 'CLAMP-30', BRAND: 'SPIDAN', NAME: 'Stainless Steel Ear Clamp 30mm' }
    ]
  },
  {
    ART_ID: 1763276,
    ART_ARTICLE_NR: '1EJ 004 440-121',
    ART_SUP_BRAND: 'HELLA',
    ART_PRODUCT_NAME: 'Headlight / Main Headlamp Assembly',
    ART_STATUS_TEXT: 'Normal',
    EAN: '4082300062830',
    PACKING_UNIT: '1 pc',
    GENERIC_ART_ID: 259,
    CRITERIA: [
      { CRI_NAME: 'Fitting Position', CRI_VALUE: 'Left' },
      { CRI_NAME: 'Lamp Type', CRI_VALUE: 'H7 / H7, W5W' },
      { CRI_NAME: 'Left-/Right-hand Traffic', CRI_VALUE: 'for right-hand traffic' },
      { CRI_NAME: 'Voltage [V]', CRI_VALUE: '12' },
      { CRI_NAME: 'Inspection Tag', CRI_VALUE: 'E1 306' }
    ],
    CROSSES: [
      { BRAND: 'BMW (OE)', NUMBER: '63 12 7 165 771', TYPE: 'Original OE' },
      { BRAND: 'VALEO', NUMBER: '043744', TYPE: 'Competitor / Aftermarket' },
      { BRAND: 'MAGNETI MARELLI', NUMBER: '710301177201', TYPE: 'Competitor / Aftermarket' }
    ],
    FITMENT: [
      { BRAND: 'BMW', MODEL: '1 Coupe (E82) M', YEARS: '2011-2012', KW: 250, HP: 340 },
      { BRAND: 'BMW', MODEL: '1 Coupe (E82) 135 i', YEARS: '2007-2013', KW: 225, HP: 306 },
      { BRAND: 'BMW', MODEL: '1 (E87) 120 d', YEARS: '2004-2011', KW: 120, HP: 163 }
    ],
    BOM_PARTS: [
      { ART_NR: '8GH 007 157-121', NAME: 'Halogen Bulb H7 12V 55W', QTY: 2 },
      { ART_NR: '9GH 001 922-001', NAME: 'Bulb W5W 12V 5W', QTY: 1 },
      { ART_NR: '6NM 007 878-041', NAME: 'Electric Headlight Leveling Actuator Motor', QTY: 1 }
    ]
  },
  {
    ART_ID: 373681,
    ART_ARTICLE_NR: '032025',
    ART_SUP_BRAND: 'EBERSPÄCHER',
    ART_PRODUCT_NAME: 'Silencer System & Exhaust Pipe Assembly',
    ART_STATUS_TEXT: 'Normal',
    EAN: '4030813032025',
    PACKING_UNIT: '1 unit',
    GENERIC_ART_ID: 3436,
    CRITERIA: [
      { CRI_NAME: 'Exhaust System', CRI_VALUE: 'Rear & Center Section' },
      { CRI_NAME: 'Material', CRI_VALUE: 'Aluminized Steel' },
      { CRI_NAME: 'Weight [kg]', CRI_VALUE: '14.2' }
    ],
    HOTSPOTS: [
      { SEN_COORD_ID: 101, SEN_COORD_X: 180, SEN_COORD_Y: 220, SEN_COORD_WIDTH: 90, SEN_COORD_HEIGHT: 55, COMPONENT_ART: '032025-01', COMPONENT_NAME: 'Front Exhaust Flange & Gasket', TYPE: 'Hotspot Area' },
      { SEN_COORD_ID: 102, SEN_COORD_X: 320, SEN_COORD_Y: 190, SEN_COORD_WIDTH: 130, SEN_COORD_HEIGHT: 80, COMPONENT_ART: '032025-02', COMPONENT_NAME: 'Intermediate Silencer / Resonator', TYPE: 'Hotspot Area' },
      { SEN_COORD_ID: 103, SEN_COORD_X: 520, SEN_COORD_Y: 160, SEN_COORD_WIDTH: 160, SEN_COORD_HEIGHT: 95, COMPONENT_ART: '032025-03', COMPONENT_NAME: 'Rear Main Silencer', TYPE: 'Hotspot Area' },
      { SEN_COORD_ID: 104, SEN_COORD_X: 690, SEN_COORD_Y: 210, SEN_COORD_WIDTH: 75, SEN_COORD_HEIGHT: 45, COMPONENT_ART: '032025-04', COMPONENT_NAME: 'Chrome Exhaust Tip / Tailpipe', TYPE: 'Hotspot Area' },
      { SEN_COORD_ID: 105, SEN_COORD_X: 470, SEN_COORD_Y: 270, SEN_COORD_WIDTH: 60, SEN_COORD_HEIGHT: 40, COMPONENT_ART: '032025-05', COMPONENT_NAME: 'Heavy-Duty Rubber Exhaust Hanger Mount', TYPE: 'Hotspot Area' }
    ]
  }
];

export const SEARCH_TREE = [
  {
    STR_ID: 100001,
    STR_LEVEL: 1,
    STR_NAME: 'Braking System',
    CHILDREN: [
      { STR_ID: 100005, STR_LEVEL: 2, STR_NAME: 'Disc Brakes' },
      { STR_ID: 100006, STR_LEVEL: 2, STR_NAME: 'Brake Pads & Shoes' },
      { STR_ID: 100007, STR_LEVEL: 2, STR_NAME: 'Brake Calipers' },
      { STR_ID: 100008, STR_LEVEL: 2, STR_NAME: 'Brake Hoses & Pipes' }
    ]
  },
  {
    STR_ID: 100002,
    STR_LEVEL: 1,
    STR_NAME: 'Drive Shaft & CV Joint',
    CHILDREN: [
      { STR_ID: 100010, STR_LEVEL: 2, STR_NAME: 'Drive Shaft Assembly' },
      { STR_ID: 100011, STR_LEVEL: 2, STR_NAME: 'CV Joint Kit' },
      { STR_ID: 100012, STR_LEVEL: 2, STR_NAME: 'Bellow Boot Kits' }
    ]
  },
  {
    STR_ID: 100003,
    STR_LEVEL: 1,
    STR_NAME: 'Lighting & Electronics',
    CHILDREN: [
      { STR_ID: 100020, STR_LEVEL: 2, STR_NAME: 'Headlights' },
      { STR_ID: 100021, STR_LEVEL: 2, STR_NAME: 'Tail Lights & Indicators' },
      { STR_ID: 100022, STR_LEVEL: 2, STR_NAME: 'Sensors & Relays' }
    ]
  },
  {
    STR_ID: 100004,
    STR_LEVEL: 1,
    STR_NAME: 'Exhaust System',
    CHILDREN: [
      { STR_ID: 100030, STR_LEVEL: 2, STR_NAME: 'Silencers & Pipes' },
      { STR_ID: 100031, STR_LEVEL: 2, STR_NAME: 'Catalytic Converters & DPF' },
      { STR_ID: 100032, STR_LEVEL: 2, STR_NAME: 'Mountings & Clamps' }
    ]
  }
];

export const TABLE_METRICS = [
  { table_name: 'ARTICLES', IndexGB: 18.42, DataGB: 34.80, RowsCount: 2845920, Engine: 'InnoDB' },
  { table_name: 'LINK_ART_GA', IndexGB: 14.20, DataGB: 22.15, RowsCount: 19401200, Engine: 'InnoDB' },
  { table_name: 'ART_LOOKUP', IndexGB: 12.85, DataGB: 19.40, RowsCount: 31200450, Engine: 'InnoDB' },
  { table_name: 'ARTICLE_CRITERIA', IndexGB: 11.30, DataGB: 16.55, RowsCount: 24150800, Engine: 'InnoDB' },
  { table_name: 'TEXT_DESIGNATIONS', IndexGB: 9.75, DataGB: 14.10, RowsCount: 8940300, Engine: 'InnoDB' },
  { table_name: 'PASSENGER_CARS', IndexGB: 4.80, DataGB: 8.20, RowsCount: 684200, Engine: 'InnoDB' },
  { table_name: 'SEARCH_TREE', IndexGB: 2.15, DataGB: 3.40, RowsCount: 145000, Engine: 'InnoDB' },
  { table_name: 'SENSITIVE_COORDINATES', IndexGB: 1.45, DataGB: 2.10, RowsCount: 520300, Engine: 'InnoDB' },
  { table_name: 'MODELS_SERIES', IndexGB: 0.85, DataGB: 1.40, RowsCount: 42100, Engine: 'InnoDB' },
  { table_name: 'MANUFACTURERS', IndexGB: 0.12, DataGB: 0.25, RowsCount: 3850, Engine: 'InnoDB' }
];

export const UNUSED_INDEXES = [
  { TABLE_SCHEMA: 'tecdoc_2q2023', TABLE_NAME: 'ART_LOOKUP', INDEX_NAME: 'IDX_ARL_LEGACY_CODE', RECOMMENDATION: 'Redundant with PRIMARY(ARL_ART_ID, ARL_SEARCH_NUMBER)' },
  { TABLE_SCHEMA: 'tecdoc_2q2023', TABLE_NAME: 'ARTICLE_CRITERIA', INDEX_NAME: 'IDX_ACR_OLD_TIMESTAMP', RECOMMENDATION: '0 index lookups recorded in 180 days' },
  { TABLE_SCHEMA: 'tecdoc_2q2023', TABLE_NAME: 'DOC_TYPES', INDEX_NAME: 'IDX_DOC_UNUSED_FLAG', RECOMMENDATION: 'Low cardinality boolean index, scan preferred' },
  { TABLE_SCHEMA: 'tecdoc_2q2023', TABLE_NAME: 'COMMERCIAL_VEHICLES', INDEX_NAME: 'IDX_CV_TEMP_IMPORT', RECOMMENDATION: 'Orphaned staging index from 2Q2023 batch load' }
];

// Query Execution Evaluator
export function executeTecDocQuery(queryItem, params = {}) {
  const filename = typeof queryItem === 'string' ? queryItem : (queryItem?.filename || '');
  const startTime = performance.now();

  let columns = [];
  let rows = [];

  switch (filename) {
    case 'get_manufacturers_for_passenger_cars.sql': {
      columns = ['MFA_ID', 'MFA_BRAND', 'COUNTRY', 'PASSENGER_CARS'];
      rows = MANUFACTURERS.filter(m => m.MFA_PC === 1).map(m => ({
        MFA_ID: m.MFA_ID,
        MFA_BRAND: m.MFA_BRAND,
        COUNTRY: m.COUNTRY,
        PASSENGER_CARS: 'Yes (1)'
      }));
      break;
    }

    case 'get_model_series_for_car_manufacturer.sql': {
      const mfaId = parseInt(params.MFA_ID || '16', 10);
      columns = ['MS_ID', 'MS_MFA_ID', 'MS_NAME', 'CONSTRUCTION_YEARS'];
      const filtered = MODELS_SERIES.filter(ms => ms.MS_MFA_ID === mfaId);
      rows = (filtered.length ? filtered : MODELS_SERIES).map(ms => ({
        MS_ID: ms.MS_ID,
        MS_MFA_ID: ms.MS_MFA_ID,
        MS_NAME: ms.MS_NAME,
        CONSTRUCTION_YEARS: `${ms.YEAR_FROM} - ${ms.YEAR_TO || 'Present'}`
      }));
      break;
    }

    case 'get_car_models_for_model_series.sql': {
      const msId = parseInt(params.MS_ID || '5877', 10);
      columns = ['PC_ID', 'PC_MODEL_DES', 'PCS_POWER_KW', 'PCS_POWER_PS', 'PCS_CAPACITY_TAX', 'INTERVAL', 'BODY_TYPE', 'ENGINE_CODE'];
      const filtered = PASSENGER_CARS.filter(pc => pc.PC_MS_ID === msId);
      rows = (filtered.length ? filtered : PASSENGER_CARS).map(pc => ({
        PC_ID: pc.PC_ID,
        PC_MODEL_DES: pc.PC_MODEL_DES,
        PCS_POWER_KW: pc.PCS_POWER_KW,
        PCS_POWER_PS: pc.PCS_POWER_PS,
        PCS_CAPACITY_TAX: `${pc.PCS_CAPACITY_TAX} ccm`,
        INTERVAL: `${pc.PCS_CONSTRUCTION_INTERVAL_START} - ${pc.PCS_CONSTRUCTION_INTERVAL_END}`,
        BODY_TYPE: pc.PCS_BODY_TYPE,
        ENGINE_CODE: pc.ENG_CODE
      }));
      break;
    }

    case 'get_passenger_car_detailed_info.sql': {
      const pcId = parseInt(params.PC_ID || '9877', 10);
      const car = PASSENGER_CARS.find(pc => pc.PC_ID === pcId) || PASSENGER_CARS[0];
      const mfa = MANUFACTURERS.find(m => m.MFA_ID === car.PC_MFA_ID) || { MFA_BRAND: 'BMW' };
      const series = MODELS_SERIES.find(ms => ms.MS_ID === car.PC_MS_ID) || { MS_NAME: '1 Coupe (E82)' };
      
      columns = ['PROPERTY', 'VALUE', 'TECHNICAL_CODE'];
      rows = [
        { PROPERTY: 'Manufacturer Brand', VALUE: mfa.MFA_BRAND, TECHNICAL_CODE: `MFA_ID=${car.PC_MFA_ID}` },
        { PROPERTY: 'Model Series', VALUE: series.MS_NAME, TECHNICAL_CODE: `MS_ID=${car.PC_MS_ID}` },
        { PROPERTY: 'Model Description', VALUE: car.PC_MODEL_DES, TECHNICAL_CODE: `PC_ID=${car.PC_ID}` },
        { PROPERTY: 'Power (kW)', VALUE: `${car.PCS_POWER_KW} kW`, TECHNICAL_CODE: 'PCS_POWER_KW' },
        { PROPERTY: 'Horsepower (HP)', VALUE: `${car.PCS_POWER_PS} HP / PS`, TECHNICAL_CODE: 'PCS_POWER_PS' },
        { PROPERTY: 'Engine Capacity Tax', VALUE: `${car.PCS_CAPACITY_TAX} ccm`, TECHNICAL_CODE: 'PCS_CAPACITY_TAX' },
        { PROPERTY: 'Engine Code', VALUE: car.ENG_CODE, TECHNICAL_CODE: 'ENG_CODE' },
        { PROPERTY: 'Fuel Type', VALUE: car.PCS_FUEL_TYPE, TECHNICAL_CODE: 'PCS_FUEL_TYPE' },
        { PROPERTY: 'Drive Type', VALUE: car.PCS_DRIVE_TYPE, TECHNICAL_CODE: 'PCS_DRIVE_TYPE' },
        { PROPERTY: 'Valves / Cylinders', VALUE: `${car.PCS_VALVES}V / ${car.PCS_CYLINDERS} Cylinders`, TECHNICAL_CODE: 'VALVES' },
        { PROPERTY: 'Production Interval', VALUE: `${car.PCS_CONSTRUCTION_INTERVAL_START} to ${car.PCS_CONSTRUCTION_INTERVAL_END}`, TECHNICAL_CODE: 'INTERVAL' },
        { PROPERTY: 'German KBA Code', VALUE: car.KBA_NUM, TECHNICAL_CODE: 'KBA' }
      ];
      break;
    }

    case 'get_all_criteria_for_article.sql': {
      const artId = parseInt(params.ART_ID || '1878343', 10);
      const article = ARTICLES.find(a => a.ART_ID === artId) || ARTICLES[0];
      columns = ['CRI_ID', 'CRITERIA_NAME', 'CRITERIA_VALUE', 'UNIT'];
      rows = article.CRITERIA.map((c, i) => ({
        CRI_ID: 100 + i * 5,
        CRITERIA_NAME: c.CRI_NAME,
        CRITERIA_VALUE: c.CRI_VALUE,
        UNIT: c.CRI_VALUE.includes('mm') ? 'mm' : (c.CRI_VALUE.includes('kg') ? 'kg' : '-')
      }));
      break;
    }

    case 'get_article_information.sql': {
      const artId = parseInt(params.ART_ID || '1878343', 10);
      const article = ARTICLES.find(a => a.ART_ID === artId) || ARTICLES[0];
      columns = ['ART_ID', 'ART_ARTICLE_NR', 'ART_SUP_BRAND', 'PRODUCT_NAME', 'STATUS', 'EAN_CODE', 'PACKING_UNIT'];
      rows = [{
        ART_ID: article.ART_ID,
        ART_ARTICLE_NR: article.ART_ARTICLE_NR,
        ART_SUP_BRAND: article.ART_SUP_BRAND,
        PRODUCT_NAME: article.ART_PRODUCT_NAME,
        STATUS: article.ART_STATUS_TEXT,
        EAN_CODE: article.EAN,
        PACKING_UNIT: article.PACKING_UNIT
      }];
      break;
    }

    case 'search_part_analogs_by_number.sql':
    case 'get_all_crosses_for_article.sql': {
      const artId = parseInt(params.ART_ID || '1878343', 10);
      const article = ARTICLES.find(a => a.ART_ID === artId) || ARTICLES[0];
      columns = ['CROSS_ID', 'BRAND', 'ARTICLE_NUMBER', 'CROSS_TYPE', 'TARGET_PRODUCT'];
      rows = article.CROSSES.map((c, i) => ({
        CROSS_ID: 9000 + i,
        BRAND: c.BRAND,
        ARTICLE_NUMBER: c.NUMBER,
        CROSS_TYPE: c.TYPE,
        TARGET_PRODUCT: article.ART_PRODUCT_NAME
      }));
      break;
    }

    case 'get_article_linkage_to_passenger_cars.sql': {
      const artId = parseInt(params.ART_ID || '1878343', 10);
      const article = ARTICLES.find(a => a.ART_ID === artId) || ARTICLES[0];
      columns = ['FIT_ID', 'MAKE', 'VEHICLE_MODEL', 'CONSTRUCTION_YEARS', 'POWER_KW', 'POWER_HP'];
      rows = article.FITMENT.map((f, i) => ({
        FIT_ID: 5001 + i,
        MAKE: f.BRAND,
        VEHICLE_MODEL: f.MODEL,
        CONSTRUCTION_YEARS: f.YEARS,
        POWER_KW: `${f.KW} kW`,
        POWER_HP: `${f.HP} HP`
      }));
      break;
    }

    case 'search_passenger_car_by_kba_number.sql': {
      const kba = params.KBA_NUM || '0005/AZC';
      columns = ['KBA_NUM', 'VEHICLE_DESCRIPTION', 'KW', 'PS', 'CAPACITY_TAX', 'INTERVAL_START', 'INTERVAL_END', 'BODY_TYPE'];
      rows = [
        {
          KBA_NUM: kba,
          VEHICLE_DESCRIPTION: 'BMW 1 Coupe (E82) M 3.0 TwinPower Turbo',
          KW: 250,
          PS: 340,
          CAPACITY_TAX: '2979 ccm',
          INTERVAL_START: '2011-04',
          INTERVAL_END: '2012-06',
          BODY_TYPE: 'Coupe'
        }
      ];
      break;
    }

    case 'search_passenger_car_by_dutch_kenteken.sql': {
      const plate = params.KENTEKEN_NUM || '2VXT04';
      columns = ['KENTEKEN', 'COUNTRY', 'VEHICLE_FULL_NAME', 'POWER_KW', 'POWER_PS', 'TAX_CAPACITY', 'CONSTRUCTION_INTERVAL', 'BODY_TYPE'];
      rows = [
        {
          KENTEKEN: plate,
          COUNTRY: 'NL (Netherlands)',
          VEHICLE_FULL_NAME: 'VOLKSWAGEN Golf VII (5G1) 2.0 TDI BlueMotion',
          POWER_KW: 110,
          POWER_PS: 150,
          TAX_CAPACITY: '1968 ccm',
          CONSTRUCTION_INTERVAL: '2012-11 to 2020-03',
          BODY_TYPE: 'Hatchback 5-Door'
        }
      ];
      break;
    }

    case 'search_passenger_car_by_french_cartes_grises.sql': {
      const carte = params.CARTES_GRISES_NUM || 'M10MCDVPUL07391';
      columns = ['CARTE_GRISE_CODE', 'COUNTRY', 'VEHICLE_FULL_NAME', 'POWER_KW', 'POWER_PS', 'TAX_CAPACITY', 'CONSTRUCTION_INTERVAL', 'BODY_TYPE'];
      rows = [
        {
          CARTE_GRISE_CODE: carte,
          COUNTRY: 'F (France)',
          VEHICLE_FULL_NAME: 'RENAULT Megane III Grandtour (KZ0/1) 1.5 dCi eco2',
          POWER_KW: 81,
          POWER_PS: 110,
          TAX_CAPACITY: '1461 ccm',
          CONSTRUCTION_INTERVAL: '2009-02 to 2015-12',
          BODY_TYPE: 'Estate / Grandtour'
        }
      ];
      break;
    }

    case 'get_diagram_hotspot_coordinates.sql': {
      const article = ARTICLES.find(a => a.ART_ID === 373681) || ARTICLES[2];
      columns = ['SEN_COORD_ID', 'SEN_COORD_X', 'SEN_COORD_Y', 'SEN_COORD_WIDTH', 'SEN_COORD_HEIGHT', 'COMPONENT_ART', 'COMPONENT_NAME', 'COORD_TYPE'];
      rows = (article.HOTSPOTS || []).map(h => ({
        SEN_COORD_ID: h.SEN_COORD_ID,
        SEN_COORD_X: h.SEN_COORD_X,
        SEN_COORD_Y: h.SEN_COORD_Y,
        SEN_COORD_WIDTH: h.SEN_COORD_WIDTH,
        SEN_COORD_HEIGHT: h.SEN_COORD_HEIGHT,
        COMPONENT_ART: h.COMPONENT_ART,
        COMPONENT_NAME: h.COMPONENT_NAME,
        COORD_TYPE: h.TYPE
      }));
      break;
    }

    case 'build_product_tree_for_passenger_car.sql':
    case 'search_product_group_tree_by_keyword.sql': {
      columns = ['STR_LEVEL', 'ROOT_NODE_TEXT', 'ROOT_NODE_STR_ID', 'CHILD_NODE_TEXT', 'CHILD_STR_ID'];
      rows = [];
      SEARCH_TREE.forEach(root => {
        root.CHILDREN.forEach(child => {
          rows.push({
            STR_LEVEL: child.STR_LEVEL,
            ROOT_NODE_TEXT: root.STR_NAME,
            ROOT_NODE_STR_ID: root.STR_ID,
            CHILD_NODE_TEXT: child.STR_NAME,
            CHILD_STR_ID: child.STR_ID
          });
        });
      });
      break;
    }

    case 'get_bom_parts_list_for_article.sql': {
      const article = ARTICLES.find(a => a.ART_ID === 1763276) || ARTICLES[1];
      columns = ['BOM_LINE_ID', 'PARENT_ARTICLE_NR', 'COMPONENT_ARTICLE_NR', 'COMPONENT_NAME', 'QUANTITY'];
      rows = (article.BOM_PARTS || []).map((b, i) => ({
        BOM_LINE_ID: i + 1,
        PARENT_ARTICLE_NR: article.ART_ARTICLE_NR,
        COMPONENT_ARTICLE_NR: b.ART_NR,
        COMPONENT_NAME: b.NAME,
        QUANTITY: b.QTY
      }));
      break;
    }

    case 'get_accessories_list_for_article.sql': {
      const article = ARTICLES.find(a => a.ART_ID === 1878343) || ARTICLES[0];
      columns = ['ACC_ID', 'PARENT_ARTICLE_NR', 'ACCESSORY_ARTICLE_NR', 'BRAND', 'ACCESSORY_NAME'];
      rows = (article.ACCESSORIES || []).map((acc, i) => ({
        ACC_ID: 10 + i,
        PARENT_ARTICLE_NR: article.ART_ARTICLE_NR,
        ACCESSORY_ARTICLE_NR: acc.ART_NR,
        BRAND: acc.BRAND,
        ACCESSORY_NAME: acc.NAME
      }));
      break;
    }

    case 'database_storage_table_sizes.sql': {
      columns = ['table_name', 'IndexGB', 'DataGB', 'RowsCount', 'Engine'];
      rows = TABLE_METRICS;
      break;
    }

    case 'audit_unused_database_indexes.sql': {
      columns = ['TABLE_SCHEMA', 'TABLE_NAME', 'INDEX_NAME', 'RECOMMENDATION'];
      rows = UNUSED_INDEXES;
      break;
    }

    // TecDoc 2018 Legacy Schema Evaluators
    case 'tecdoc2018_get_makes.sql': {
      const type = (params.TYPE || 'passenger').toLowerCase();
      columns = ['id', 'name', 'matchcode', 'type', 'canbedisplayed'];
      if (type === 'commercial') {
        rows = [
          { id: 74, name: 'MERCEDES-BENZ', matchcode: 'MERCEDES', type: 'commercial', canbedisplayed: 'True' },
          { id: 120, name: 'VOLVO', matchcode: 'VOLVO', type: 'commercial', canbedisplayed: 'True' },
          { id: 88, name: 'MAN TRUCKS', matchcode: 'MAN', type: 'commercial', canbedisplayed: 'True' },
          { id: 95, name: 'SCANIA', matchcode: 'SCANIA', type: 'commercial', canbedisplayed: 'True' },
          { id: 99, name: 'DAF', matchcode: 'DAF', type: 'commercial', canbedisplayed: 'True' }
        ];
      } else if (type === 'motorbike') {
        rows = [
          { id: 16, name: 'BMW MOTORRAD', matchcode: 'BMW MOTO', type: 'motorbike', canbedisplayed: 'True' },
          { id: 46, name: 'HONDA MOTORCYCLES', matchcode: 'HONDA MOTO', type: 'motorbike', canbedisplayed: 'True' },
          { id: 69, name: 'YAMAHA', matchcode: 'YAMAHA', type: 'motorbike', canbedisplayed: 'True' },
          { id: 71, name: 'DUCATI', matchcode: 'DUCATI', type: 'motorbike', canbedisplayed: 'True' },
          { id: 72, name: 'KTM', matchcode: 'KTM', type: 'motorbike', canbedisplayed: 'True' }
        ];
      } else if (type === 'engine') {
        rows = [
          { id: 301, name: 'DEUTZ AG', matchcode: 'DEUTZ', type: 'engine', canbedisplayed: 'True' },
          { id: 302, name: 'CUMMINS ENGINE CO.', matchcode: 'CUMMINS', type: 'engine', canbedisplayed: 'True' },
          { id: 303, name: 'CATERPILLAR', matchcode: 'CAT', type: 'engine', canbedisplayed: 'True' },
          { id: 304, name: 'PERKINS', matchcode: 'PERKINS', type: 'engine', canbedisplayed: 'True' }
        ];
      } else if (type === 'axle') {
        rows = [
          { id: 401, name: 'SAF-HOLLAND', matchcode: 'SAF', type: 'axle', canbedisplayed: 'True' },
          { id: 402, name: 'BPW BERGISCHE ACHSEN', matchcode: 'BPW', type: 'axle', canbedisplayed: 'True' },
          { id: 403, name: 'MERITOR', matchcode: 'MERITOR', type: 'axle', canbedisplayed: 'True' }
        ];
      } else {
        rows = MANUFACTURERS.map(m => ({
          id: m.MFA_ID,
          name: m.MFA_BRAND,
          matchcode: m.MFA_BRAND,
          type: 'passenger',
          canbedisplayed: 'True'
        }));
      }
      break;
    }

    case 'tecdoc2018_get_models.sql': {
      columns = ['id', 'name', 'constructioninterval', 'manufacturerid'];
      rows = [
        { id: 5376, name: 'A4 (8EC, B7)', constructioninterval: '11.2004 - 06.2008', manufacturerid: 5 },
        { id: 5890, name: 'A4 (8K2, B8)', constructioninterval: '11.2007 - 12.2015', manufacturerid: 5 },
        { id: 4949, name: 'A3 (8P1)', constructioninterval: '05.2003 - 08.2012', manufacturerid: 5 },
        { id: 5122, name: 'A6 (4F2, C6)', constructioninterval: '05.2004 - 03.2011', manufacturerid: 5 }
      ];
      break;
    }

    case 'tecdoc2018_get_modifications.sql': {
      columns = ['id', 'name', 'attributegroup', 'attributetype', 'displaytitle', 'displayvalue'];
      rows = [
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Engine', attributetype: 'Engine Type', displaytitle: 'Engine Type', displayvalue: 'Petrol / Direct Injection Turbo' },
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Engine', attributetype: 'Engine Code', displaytitle: 'Engine Code', displayvalue: 'BGB / BWE' },
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Performance', attributetype: 'Engine Output', displaytitle: 'Output in kW / HP', displayvalue: '147 kW / 200 HP' },
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Dimensions', attributetype: 'Capacity', displaytitle: 'Displacement', displayvalue: '1,984 ccm' },
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Drivetrain', attributetype: 'Drive Type', displaytitle: 'Drive Type', displayvalue: 'All-wheel Drive (quattro)' },
        { id: 18371, name: '2.0 TFSI quattro', attributegroup: 'Body', attributetype: 'Body Design', displaytitle: 'Body Style', displayvalue: 'Saloon / Sedan' }
      ];
      break;
    }

    case 'tecdoc2018_get_sections_tree.sql': {
      columns = ['id', 'description', 'havechild', 'passangercarid', 'parentId'];
      rows = [
        { id: 100006, description: 'Brake System', havechild: 1, passangercarid: 18371, parentId: 0 },
        { id: 100005, description: 'Engine & Cooling', havechild: 1, passangercarid: 18371, parentId: 0 },
        { id: 100010, description: 'Suspension & Steering', havechild: 1, passangercarid: 18371, parentId: 0 },
        { id: 100012, description: 'Drivetrain & Transmission', havechild: 1, passangercarid: 18371, parentId: 0 },
        { id: 100018, description: 'Filters & Service Maintenance', havechild: 0, passangercarid: 18371, parentId: 0 },
        { id: 100024, description: 'Electrics & Lighting', havechild: 1, passangercarid: 18371, parentId: 0 }
      ];
      break;
    }

    case 'tecdoc2018_get_section_parts.sql': {
      columns = ['part_number', 'supplier_name', 'product_name', 'node_id', 'linkage_id'];
      rows = [
        { part_number: '20430', supplier_name: 'SPIDAN', product_name: 'Bellow Kit, drive shaft boot', node_id: 100006, linkage_id: 18371 },
        { part_number: '0 986 479 155', supplier_name: 'BOSCH', product_name: 'Brake Disc Front Vented 320mm', node_id: 100006, linkage_id: 18371 },
        { part_number: '13.0460-7110.2', supplier_name: 'ATE', product_name: 'Brake Pad Set Disc Brake Front', node_id: 100006, linkage_id: 18371 },
        { part_number: 'GDB1550', supplier_name: 'TRW', product_name: 'Brake Pad Set Disc Brake Rear', node_id: 100006, linkage_id: 18371 }
      ];
      break;
    }

    case 'tecdoc2018_get_oem_numbers.sql': {
      columns = ['manufacturer', 'oe_number', 'article_number', 'supplier'];
      rows = [
        { manufacturer: 'AUDI / VW', oe_number: '8E0 698 151 K', article_number: '20430', supplier: 'SPIDAN' },
        { manufacturer: 'AUDI / VW', oe_number: '8E0 698 151 J', article_number: '20430', supplier: 'SPIDAN' },
        { manufacturer: 'BMW', oe_number: '31 60 7 565 315', article_number: '20430', supplier: 'SPIDAN' },
        { manufacturer: 'BMW', oe_number: '31 60 7 565 316', article_number: '20430', supplier: 'SPIDAN' }
      ];
      break;
    }

    case 'tecdoc2018_get_art_status.sql': {
      columns = ['NormalizedDescription', 'ArticleStateDisplayValue', 'ArticleNumber', 'Supplier'];
      rows = [
        { NormalizedDescription: 'Bellow Kit, drive shaft boot', ArticleStateDisplayValue: 'Normal (Active Production)', ArticleNumber: '20430', Supplier: 'SPIDAN' }
      ];
      break;
    }

    case 'tecdoc2018_get_art_attributes.sql': {
      columns = ['attributeinformationtype', 'displaytitle', 'displayvalue'];
      rows = [
        { attributeinformationtype: 'Technical Specification', displaytitle: 'Fitting Position', displayvalue: 'Front Axle, Wheel Side' },
        { attributeinformationtype: 'Dimension', displaytitle: 'Internal Diameter 1 [mm]', displayvalue: '28' },
        { attributeinformationtype: 'Dimension', displaytitle: 'Internal Diameter 2 [mm]', displayvalue: '86' },
        { attributeinformationtype: 'Dimension', displaytitle: 'Height [mm]', displayvalue: '148' },
        { attributeinformationtype: 'Material', displaytitle: 'Material Composition', displayvalue: 'Thermoplastic Elastomer' }
      ];
      break;
    }

    case 'tecdoc2018_get_art_cross.sql': {
      columns = ['cross_brand', 'cross_part_number', 'common_oe', 'status'];
      rows = [
        { cross_brand: 'LÖBRO', cross_part_number: '304560', common_oe: '31 60 7 565 315', status: 'Direct OEM Equivalent' },
        { cross_brand: 'SKF', cross_part_number: 'VKJP 1098', common_oe: '31 60 7 565 315', status: 'Direct OEM Equivalent' },
        { cross_brand: 'FEBI BILSTEIN', cross_part_number: '38760', common_oe: '31 60 7 565 316', status: 'Matching Geometry' },
        { cross_brand: 'MEYLE', cross_part_number: '314 498 0021', common_oe: '31 60 7 565 316', status: 'Heavy Duty HD Upgrade' }
      ];
      break;
    }

    case 'tecdoc2018_get_art_parts.sql': {
      columns = ['component_number', 'brand', 'quantity', 'assembly_parent'];
      rows = [
        { component_number: '1763277', brand: 'SPIDAN', quantity: 1, assembly_parent: '20430 Kit' },
        { component_number: '990021 (Grease)', brand: 'SPIDAN', quantity: 1, assembly_parent: '20430 Kit' },
        { component_number: '990145 (Clamp Large)', brand: 'SPIDAN', quantity: 1, assembly_parent: '20430 Kit' },
        { component_number: '990146 (Clamp Small)', brand: 'SPIDAN', quantity: 1, assembly_parent: '20430 Kit' },
        { component_number: '990302 (Snap Ring)', brand: 'SPIDAN', quantity: 1, assembly_parent: '20430 Kit' }
      ];
      break;
    }

    // TecDoc 2017 Change Request (CR) Delta Queries
    case 'tecdoc2017_cr_herst_new.sql': {
      columns = ['vehicle_man_no', 'manufacturer_name', 'short_code', 'brand_trading_name'];
      rows = [
        { vehicle_man_no: 1450, manufacturer_name: 'SISU AUTO', short_code: 'SISU', brand_trading_name: 'Sisu Auto AB (Heavy Commercial)' },
        { vehicle_man_no: 1482, manufacturer_name: 'CHANGAN AUTOMOBILE', short_code: 'CHANGAN', brand_trading_name: 'Changan Automobile Co.' },
        { vehicle_man_no: 1510, manufacturer_name: 'MTU FRIEDRICHSHAFEN', short_code: 'MTU', brand_trading_name: 'Rolls-Royce Power Systems / MTU' },
        { vehicle_man_no: 1534, manufacturer_name: 'JS ASAKASHI', short_code: 'ASAKASHI', brand_trading_name: 'JS Asakashi Filtration Corp' },
        { vehicle_man_no: 1560, manufacturer_name: 'MOTORCRAFT COMMERCIAL', short_code: 'MOTORCRAFT', brand_trading_name: 'Ford Motorcraft Commercial' },
        { vehicle_man_no: 1595, manufacturer_name: 'DONGFENG MOTOR', short_code: 'DFM', brand_trading_name: 'Dongfeng Motor Corp' },
        { vehicle_man_no: 1622, manufacturer_name: 'FOTON MOTOR', short_code: 'FOTON', brand_trading_name: 'Beiqi Foton Motor Co.' },
        { vehicle_man_no: 1648, manufacturer_name: 'DANA SPICER AXLES', short_code: 'SPICER', brand_trading_name: 'Dana Holding Corporation' }
      ];
      break;
    }

    case 'tecdoc2017_cr_mod_new.sql': {
      columns = ['model_id', 'model_name', 'manufacturer_id', 'production_start', 'production_end'];
      rows = [
        { model_id: 12450, model_name: '5 Touring (G31)', manufacturer_id: 16, production_start: '03.2017', production_end: '10.2023' },
        { model_id: 12455, model_name: 'X3 (G01)', manufacturer_id: 16, production_start: '06.2017', production_end: 'Present' },
        { model_id: 12510, model_name: 'E-Class All-Terrain (S213)', manufacturer_id: 74, production_start: '01.2017', production_end: '08.2023' },
        { model_id: 12520, model_name: 'A8 D5 (4N2, 4N8)', manufacturer_id: 5, production_start: '07.2017', production_end: 'Present' },
        { model_id: 12580, model_name: 'Arteon (3H7, 3H8)', manufacturer_id: 121, production_start: '04.2017', production_end: '12.2023' },
        { model_id: 12610, model_name: 'CS75 Plus SUV', manufacturer_id: 1482, production_start: '02.2017', production_end: 'Present' },
        { model_id: 12650, model_name: 'Polar Heavy Hauler 8x4', manufacturer_id: 1450, production_start: '01.2017', production_end: 'Present' }
      ];
      break;
    }

    case 'tecdoc2017_cr_fzg_new.sql': {
      columns = ['k_type_id', 'vehicle_trim', 'power_kw', 'power_hp', 'displacement_ccm', 'production_start'];
      rows = [
        { k_type_id: 124501, vehicle_trim: '520d xDrive (G31)', power_kw: 140, power_hp: 190, displacement_ccm: 1995, production_start: '03.2017' },
        { k_type_id: 124502, vehicle_trim: '530i (G31)', power_kw: 185, power_hp: 252, displacement_ccm: 1998, production_start: '03.2017' },
        { k_type_id: 124551, vehicle_trim: 'xDrive 20d (G01)', power_kw: 140, power_hp: 190, displacement_ccm: 1995, production_start: '06.2017' },
        { k_type_id: 125101, vehicle_trim: 'E 220 d 4MATIC All-Terrain (213.217)', power_kw: 143, power_hp: 194, displacement_ccm: 1950, production_start: '01.2017' },
        { k_type_id: 125201, vehicle_trim: '50 TDI Mild Hybrid quattro (4N2)', power_kw: 210, power_hp: 286, displacement_ccm: 2967, production_start: '07.2017' },
        { k_type_id: 125801, vehicle_trim: '2.0 TSI (3H7)', power_kw: 206, power_hp: 280, displacement_ccm: 1984, production_start: '04.2017' }
      ];
      break;
    }

    case 'tecdoc2017_cr_mcode_new.sql': {
      columns = ['engine_id', 'motor_code', 'displacement_cc', 'fuel_type', 'manufacturer_id'];
      rows = [
        { engine_id: 30120, motor_code: 'B47 D20 A', displacement_cc: 1995, fuel_type: 'Diesel (Common Rail)', manufacturer_id: 16 },
        { engine_id: 30125, motor_code: 'B48 B20 B', displacement_cc: 1998, fuel_type: 'Petrol (TwinPower)', manufacturer_id: 16 },
        { engine_id: 30210, motor_code: 'OM 654.920', displacement_cc: 1950, fuel_type: 'Diesel (CDI Bluetec)', manufacturer_id: 74 },
        { engine_id: 30280, motor_code: 'DDVC / EA897evo2', displacement_cc: 2967, fuel_type: 'Diesel / 48V MHEV', manufacturer_id: 5 },
        { engine_id: 30340, motor_code: 'DJHC / EA888 Gen 3', displacement_cc: 1984, fuel_type: 'Petrol (TSI Turbo)', manufacturer_id: 121 },
        { engine_id: 30410, motor_code: 'JL476ZQCF', displacement_cc: 1499, fuel_type: 'Petrol Turbo', manufacturer_id: 1482 }
      ];
      break;
    }

    case 'tecdoc2017_cr_genart_cng.sql': {
      columns = ['generic_article_id', 'master_description', 'assembly_group', 'old_criterion', 'new_criterion', 'is_mandatory'];
      rows = [
        { generic_article_id: 82, master_description: 'Brake Disc', assembly_group: 'Braking System', old_criterion: 'Diameter [mm] (Optional)', new_criterion: 'Diameter & Min Thickness (SA210)', is_mandatory: 'YES (1)' },
        { generic_article_id: 402, master_description: 'Shock Absorber', assembly_group: 'Suspension', old_criterion: 'Mounting Type (SA400 Optional)', new_criterion: 'Mounting Type & System Twin-Tube', is_mandatory: 'YES (1)' },
        { generic_article_id: 7, master_description: 'Oil Filter', assembly_group: 'Filtration', old_criterion: 'Thread Size', new_criterion: 'Filter Type & Bypass Valve Bar', is_mandatory: 'YES (1)' },
        { generic_article_id: 800, master_description: 'Bellow Kit, drive shaft boot', assembly_group: 'Wheel Drive', old_criterion: 'Diameter 1 / 2', new_criterion: 'Fitting Position & Material (TPE)', is_mandatory: 'YES (1)' },
        { generic_article_id: 161, master_description: 'Alternator / Generator', assembly_group: 'Electrical', old_criterion: 'Voltage [V]', new_criterion: 'Charge Current [A] & Pulley Dia', is_mandatory: 'YES (1)' }
      ];
      break;
    }

    case 'tecdoc2017_cr_achse_new.sql': {
      columns = ['axle_type_no', 'manufacturer', 'series_name', 'axle_type', 'my_from'];
      rows = [
        { axle_type_no: 91001, manufacturer: 'DANA / SPICER', series_name: 'D170 Heavy Tandem', axle_type: 'Drive Axle, Hypoid Single Reduction', my_from: 2017 },
        { axle_type_no: 91002, manufacturer: 'DANA / SPICER', series_name: 'S140 Single Rear', axle_type: 'Drive Axle, Medium Commercial', my_from: 2017 },
        { axle_type_no: 91003, manufacturer: 'SAF-HOLLAND', series_name: 'INTRAAX Plus A22', axle_type: 'Air Suspension Trailer Axle 9t', my_from: 2017 },
        { axle_type_no: 91004, manufacturer: 'BPW BERGISCHE ACHSEN', series_name: 'ECO Plus 3 Disc', axle_type: 'Trailer Axle with Integral Disc Brake', my_from: 2017 }
      ];
      break;
    }

    case 'tecdoc2017_cr_fzglndspez_new.sql': {
      columns = ['vehicle_id', 'country_iso', 'restriction_type', 'market_description'];
      rows = [
        { vehicle_id: 124501, country_iso: 'DE', restriction_type: 'Standard Release', market_description: 'Euro 6d-TEMP emission regulation compliance' },
        { vehicle_id: 124501, country_iso: 'GB', restriction_type: 'Right Hand Drive', market_description: 'UK spec headlamp beam angle & imperial speedo' },
        { vehicle_id: 125101, country_iso: 'US', restriction_type: 'Not Marketed', market_description: 'All-Terrain wagon variant not imported to North America' },
        { vehicle_id: 125801, country_iso: 'CN', restriction_type: 'Long Wheelbase Specific', market_description: 'Volkswagen CC / Arteon extended wheelbase localization' },
        { vehicle_id: 126101, country_iso: 'RU', restriction_type: 'Cold Climate Package', market_description: 'Enhanced battery capacity & auxiliary heating standard' }
      ];
      break;
    }

    default: {
      columns = ['COLUMN_1', 'COLUMN_2', 'COLUMN_3', 'COLUMN_4'];
      rows = [
        { COLUMN_1: 'TecDoc 2Q 2023 Query Executed', COLUMN_2: filename, COLUMN_3: 'Query Status: SUCCESS', COLUMN_4: `${Object.keys(params).length} parameters applied` },
        { COLUMN_1: 'Dataset Version', COLUMN_2: '2Q 2023 Full Multi-Language', COLUMN_3: 'Total Tables: 84', COLUMN_4: 'Total Articles: 2.8M+' },
        { COLUMN_1: 'Active LNGID', COLUMN_2: params.LNGID || '4 (English)', COLUMN_3: 'Encoding: UTF-8', COLUMN_4: 'Index Cache: Optimized' }
      ];
      break;
    }
  }

  const duration = Math.round((performance.now() - startTime + Math.random() * 8 + 3) * 100) / 100;

  return {
    success: true,
    executionTimeMs: duration,
    rowCount: rows.length,
    columns,
    rows
  };
}
