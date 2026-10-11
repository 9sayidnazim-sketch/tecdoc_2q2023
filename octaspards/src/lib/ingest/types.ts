// Ingestion & Merge Pipeline Types

export type SourcePriority = "tecdoc_official" | "oem_epc" | "autodoc_feed" | "dubai_central_parts";

export const SOURCE_PRIORITY_ORDER: SourcePriority[] = [
  "tecdoc_official",
  "oem_epc",
  "autodoc_feed",
  "dubai_central_parts",
];

export interface IngestPartNumber {
  numberRaw: string;
  type: "OE" | "AFTERMARKET" | "EAN" | "SUPPLIER";
  brandName: string;
  isPrimary?: boolean;
}

export interface IngestVehicle {
  make: string;
  model: string;
  generation?: string;
  yearFrom?: number;
  yearTo?: number;
  engine?: string;
  fuel?: string;
  body?: string;
  marketSpec: "GCC" | "EU" | "US" | "GLOBAL";
  externalVehicleId?: string;
}

export interface IngestFitment {
  vehicle: IngestVehicle;
  source: string;
  notes?: string;
}

export interface IngestCrossReference {
  targetNumberRaw: string;
  brandName: string;
  type?: "EQUIVALENT" | "SUPERSEDES" | "SUPERSEDED_BY";
  source: string;
}

export interface IngestImage {
  url: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
  source: string;
  altText?: string;
  sortOrder?: number;
}

export interface IngestPrice {
  supplier: string;
  cost: number;
  currency: string;
  marginRule: string; // e.g. "MARGIN_25_PLUS_VAT_5"
  stockStatus: "IN_STOCK" | "2_3_DAYS" | "ON_REQUEST";
  stockQuantity: number;
}

export interface IngestPart {
  brandName: string;
  brandCountry?: string;
  name: string;
  nameAr?: string;
  description?: string;
  assemblyGroupName: string;
  assemblyGroupNameAr?: string;
  productGroupName: string;
  productGroupNameAr?: string;
  specs?: Record<string, string | number | boolean>;
  sourceName: SourcePriority;
  numbers: IngestPartNumber[];
  crossReferences?: IngestCrossReference[];
  images?: IngestImage[];
  prices?: IngestPrice[];
  fitments?: IngestFitment[];
  rawSourceData?: any;
}

export interface ApiSourceAdapter {
  readonly name: SourcePriority;
  readonly label: string;
  fetchParts(): Promise<IngestPart[]>;
  fetchFitment?(partNumbers: string[]): Promise<IngestFitment[]>;
  fetchImages?(partNumbers: string[]): Promise<IngestImage[]>;
  fetchPrices?(partNumbers: string[]): Promise<IngestPrice[]>;
}
