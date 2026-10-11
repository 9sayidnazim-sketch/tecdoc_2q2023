/**
 * Automotive Parts Unified Search Orchestrator Types
 * ISO/TecDoc standard compliant data model and provider interface
 */

export type InputCategory =
  | "VIN"
  | "KBA"
  | "REGISTRATION_MARK"
  | "EAN_BARCODE"
  | "OE_REFERENCE"
  | "ARTICLE_NUMBER"
  | "DESCRIPTIVE_TEXT"
  | "AMBIGUOUS_NUMBER";

export interface InputClassification {
  category: InputCategory;
  rawInput: string;
  cleanedInput: string;
  normalizedInput: string;
  variants: string[];
  detectedBrand?: string;
  countryContext?: string;
  isAmbiguous: boolean;
  ambiguousCandidates?: {
    type: InputCategory;
    label: string;
    variant: string;
  }[];
}

export type ProviderId =
  | "canonical_pg"
  | "tecdoc_2q2023"
  | "tecdoc_pegasus"
  | "autodoc_feed"
  | "vin_kba_decoder"
  | "oem_epc"
  | "dubai_parts_hub";

export type ProviderHealthStatus =
  | "VERIFIED_WORKING"
  | "CONFIGURATION_REQUIRED"
  | "ACCESS_UNAVAILABLE"
  | "TEMPORARILY_FAILING"
  | "UNVERIFIED";

export interface ProviderInventoryItem {
  id: ProviderId;
  name: string;
  purpose: string;
  actualOperations: string[];
  requiredInputs: string[];
  authLocation: string;
  dependencies: string[];
  entitlement: string;
  status: ProviderHealthStatus;
  verificationEvidence: string;
  lastChecked?: string;
  errorMessage?: string;
  suggestedAction?: string;
}

export type FitmentStatus =
  | "FITS_VEHICLE_VERIFIED"
  | "FITS_VEHICLE_SINGLE"
  | "FITMENT_UNCONFIRMED"
  | "CHECK_FITMENT";

export type MatchKind =
  | "SAME_ARTICLE"
  | "OE_REFERENCE"
  | "AFTERMARKET_EQUIVALENT"
  | "SUPERSEDES"
  | "SUPERSEDED_BY"
  | "POSSIBLE_MATCH";

export interface SourceAttribution {
  providerId: ProviderId;
  providerName: string;
  retrievalTime: string;
  verificationStatus: "VERIFIED" | "FALLBACK" | "UNVERIFIED";
  cached: boolean;
}

export interface OrchestratedPartMatch {
  id: number | string;
  partNumber: string;
  brandName: string;
  productName: string;
  productNameAr?: string | null;
  description?: string | null;
  assemblyGroupName?: string | null;
  productGroupName?: string | null;
  matchKind: MatchKind;
  matchedOn: string;
  matchedValue: string;
  score: number;
  specs: Record<string, string | number | boolean>;
  oeReferences: {
    number: string;
    brandName: string;
    source: string;
  }[];
  crossReferences: {
    number: string;
    brandName: string;
    type: string;
    source: string;
  }[];
  fitments: {
    vehicleId: number | string;
    make: string;
    model: string;
    generation?: string | null;
    yearFrom?: number | null;
    yearTo?: number | null;
    engine?: string | null;
    fuel?: string | null;
    marketSpec?: string;
    confidence: "VERIFIED" | "SINGLE" | "UNVERIFIED";
    source: string;
    notes?: string | null;
  }[];
  images: {
    id: number | string;
    url: string;
    thumbnailUrl: string;
    isPrimary: boolean;
    source: string;
    altText?: string | null;
  }[];
  price: {
    sellPriceAed: number | null;
    currency: string;
    stockStatus: string; // IN_STOCK, 2_3_DAYS, ON_REQUEST
    stockQuantity: number;
    vatLabel: string; // "incl. 5% VAT"
    supplierAttribution?: string;
  };
  sources: SourceAttribution[];
  fitmentStatus: FitmentStatus;
}

export interface OrchestratedVehicleMatch {
  id: number | string;
  make: string;
  model: string;
  generation?: string | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  engine?: string | null;
  engineCode?: string | null;
  fuel?: string | null;
  powerKw?: number | null;
  capacityCc?: number | null;
  marketSpec: string;
  kbaCode?: string | null;
  vinCode?: string | null;
  label: string;
  source: SourceAttribution;
  linkedPartCount?: number;
}

export interface OrchestratedSearchResponse {
  query: string;
  classification: InputClassification;
  totalHits: number;
  tookMs: number;
  contextVehicle?: OrchestratedVehicleMatch | null;
  parts: OrchestratedPartMatch[];
  vehicles: OrchestratedVehicleMatch[];
  providerStatuses: {
    providerId: ProviderId;
    status: ProviderHealthStatus;
    tookMs: number;
    hitsCount: number;
    error?: string;
  }[];
}
