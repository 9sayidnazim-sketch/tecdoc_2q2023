import type { SearchMode } from "./validation";

export type CrossRefKind = "EQUIVALENT" | "SUPERSEDES" | "SUPERSEDED_BY";

export interface PartImageDto {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  isPrimary: boolean;
  altText: string | null;
}

export interface PartPriceDto {
  sellPriceAed: number | null;
  currency: string;
  stockStatus: string; // "IN_STOCK", "2_3_DAYS", "ON_REQUEST"
  stockQuantity: number;
  vatLabel: string; // "incl. 5% VAT"
}

export interface PartFitmentDto {
  vehicleId: number;
  make: string;
  model: string;
  generation: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  engine: string | null;
  fuel: string | null;
  body: string | null;
  marketSpec: string;
  confidence: "VERIFIED" | "SINGLE" | "UNVERIFIED";
  notes?: string | null;
}

export interface PartCrossDto {
  brandName: string;
  number: string;
  type: string;
  partId?: number | null;
}

export interface PartOeDto {
  number: string;
  brandName: string;
}

export interface VehicleSummary {
  id: number;
  manufacturer: string; // make
  manufacturerId: number;
  model: string;
  modelId: number;
  name: string; // engine / trim / generation
  engineCode: string | null;
  fuel: string | null;
  powerKw: number | null;
  capacityCc: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  marketSpec?: string;
}

export interface PartHit {
  kind: "part";
  id: number;
  partNumber: string;
  name: string;
  nameAr: string | null;
  description?: string | null;
  specs?: Record<string, any> | null;
  brand: { id: number; name: string };
  productGroup?: { id: number; name: string; nameAr: string | null } | null;
  assemblyGroup?: { id: number; name: string; nameAr: string | null } | null;
  /** Which identifier matched the query */
  matchedOn: "PART" | "OE" | "EQUIVALENT" | "SUPERSEDES" | "SUPERSEDED_BY" | "NAME" | "FILTER";
  matchedValue: string | null;
  score: number;
  fitmentCount: number;

  // UAE TecDoc enhancements
  primaryImage?: PartImageDto | null;
  images?: PartImageDto[];
  price?: PartPriceDto | null;
  oeNumbers?: PartOeDto[];
  crossReferences?: PartCrossDto[];
  fitments?: PartFitmentDto[];
  vehicles?: VehicleSummary[];
  sources?: {
    providerId: string;
    providerName: string;
    retrievalTime: string;
    verificationStatus: string;
  }[];
  fitmentStatus?: "FITS_VEHICLE_VERIFIED" | "FITS_VEHICLE_SINGLE" | "FITMENT_UNCONFIRMED" | "CHECK_FITMENT";
}

export interface VehicleHit {
  kind: "vehicle";
  id: number | string;
  label: string;
  vehicle: VehicleSummary;
  partCount: number;
  score: number;
}

export interface EntityHit {
  kind: "brand" | "productGroup" | "assemblyGroup";
  id: number;
  name: string;
  nameAr: string | null;
  partCount: number;
  score: number;
}

export type SearchItem = PartHit | VehicleHit | EntityHit;

export interface SearchResponse {
  mode: SearchMode;
  q: string;
  exact: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  tookMs: number;
  /** Resolved filter context (e.g. the selected vehicle) when filtering parts */
  context?: {
    vehicle?: VehicleSummary;
    brand?: string;
    productGroup?: string;
    assemblyGroup?: string;
  };
  classification?: {
    category: string;
    isAmbiguous: boolean;
    detectedType: string;
    variants?: string[];
  };
  providerStatuses?: {
    providerId: string;
    status: string;
    tookMs: number;
    hitsCount: number;
    error?: string;
  }[];
  items: SearchItem[];
}

export interface CatalogOption {
  id: number;
  label: string;
  labelAr?: string | null;
  hint?: string | null;
}

export interface ManufacturerChip {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export interface BannerDto {
  id: number;
  title: string;
  titleAr: string | null;
  subtitle: string | null;
  subtitleAr: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  active: boolean;
}

export interface SearchSuggestion {
  type: "part" | "oe" | "vehicle" | "brand";
  text: string;
  subtext?: string;
  brand?: string;
  partId?: number;
  vehicleId?: number;
  imageUrl?: string;
  priceAed?: number | null;
  partNumber?: string;
  name?: string;
  matchedNumber?: string;
}

export interface ApiError {
  error: string;
  issues?: { path: string; message: string }[];
}
