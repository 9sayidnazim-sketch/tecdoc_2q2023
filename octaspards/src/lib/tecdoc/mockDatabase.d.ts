export const MANUFACTURERS: any[];
export const MODELS_SERIES: any[];
export const PASSENGER_CARS: any[];
export const COMMERCIAL_VEHICLES: any[];
export const MOTORBIKES: any[];
export const ENGINES: any[];
export const AXLES: any[];
export const ARTICLES: any[];
export const SEARCH_TREE: any[];
export const TABLE_METRICS: any[];
export const UNUSED_INDEXES: any[];
export const TECDOC_2018_SCHEMA_MAP: any[];
export const TECDOC_2017_CR_DELTAS: any[];

export function executeTecDocQuery(
  queryItem: any,
  params?: Record<string, any>
): {
  success: boolean;
  executionTimeMs: number;
  rowCount: number;
  columns: string[];
  rows: any[];
};
