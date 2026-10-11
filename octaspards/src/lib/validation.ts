import { z } from "zod";

const optionalId = z.coerce.number().int().positive().optional();

/** Query-string booleans: "1" | "true" | "on" -> true, anything else -> false */
const qsBoolean = z
  .union([z.string(), z.boolean()])
  .optional()
  .transform((v) => v === true || v === "1" || v === "true" || v === "on");

export const searchModes = ["number", "vehicle", "brand", "vin", "kba", "oe", "all"] as const;
export type SearchMode = (typeof searchModes)[number];

export const searchQuerySchema = z
  .object({
    q: z.string().trim().max(150).default(""),
    mode: z.enum(searchModes).default("number"),
    exact: qsBoolean,
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
    include: z.enum(["full", "summary"]).default("full"),
    vehicleId: optionalId,
    manufacturerId: optionalId,
    modelId: optionalId,
    vehicleTypeId: optionalId,
    brandId: optionalId,
    productGroupId: optionalId,
    assemblyGroupId: optionalId,
    apiKey: z.string().trim().max(150).optional(),
    api_key: z.string().trim().max(150).optional(),
    key: z.string().trim().max(150).optional(),
  })
  .passthrough();

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const catalogKinds = [
  "manufacturers",
  "models",
  "types",
  "vehicle-types",
  "brands",
  "product-groups",
  "assembly-groups",
] as const;
export type CatalogKind = (typeof catalogKinds)[number];

export const catalogQuerySchema = z
  .object({
    kind: z.enum(catalogKinds),
    manufacturerId: optionalId,
    modelId: optionalId,
    vehicleTypeId: optionalId,
    assemblyGroupId: optionalId,
  })
  .strict();

export const recentPostSchema = z.object({ manufacturerId: z.number().int().positive() }).strict();

export const recentQuerySchema = z
  .object({ limit: z.coerce.number().int().min(1).max(60).default(9) })
  .strict();

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

export const bannerInputSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    titleAr: z.string().trim().max(120).nullish(),
    subtitle: z.string().trim().max(240).nullish(),
    subtitleAr: z.string().trim().max(240).nullish(),
    imageUrl: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .refine((v) => v.startsWith("/") || /^https:\/\//.test(v), "Must be a site path (/...) or https:// URL"),
    linkUrl: z
      .string()
      .trim()
      .max(500)
      .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Must be a site path or https:// URL")
      .nullish(),
    sortOrder: z.number().int().min(0).max(1000).default(0),
    active: z.boolean().default(true),
  })
  .strict();

export type BannerInput = z.infer<typeof bannerInputSchema>;

/** Convert URLSearchParams to a plain object, dropping empty values. */
export function paramsToObject(params: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  params.forEach((value, key) => {
    if (value !== "") out[key] = value;
  });
  return out;
}
