"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PartDetailModal } from "./PartDetailModal";
import type { PartHit, SearchResponse, VehicleHit, EntityHit } from "@/lib/types";

interface SearchResultsProps {
  data: SearchResponse | null;
  loading: boolean;
  onPageChange: (newPage: number) => void;
  onSelectVehicle?: (vehicleId: number) => void;
  onClearFilterContext?: () => void;
}

export function SearchResults({
  data,
  loading,
  onPageChange,
  onSelectVehicle,
  onClearFilterContext,
}: SearchResultsProps) {
  const { t, locale } = useI18n();
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-cardBorder shadow-card p-6 space-y-5 animate-in fade-in-50 duration-150">
        {/* Animated Searching Card Banner */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
              <span className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <span className="absolute w-2 h-2 rounded-full bg-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Searching Auto Parts Catalogue...</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent text-white">
                  Live Scanner
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Scanning TecDoc cross-references, OE genuine numbers, and Dubai warehouse inventory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PostgreSQL GIN Trigram Search</span>
          </div>
        </div>

        {/* Shimmering Skeleton Cards */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="w-full sm:w-32 h-32 rounded-lg bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="flex gap-2">
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                  <div className="w-28 h-4 bg-slate-200 rounded" />
                </div>
                <div className="w-3/4 h-5 bg-slate-200 rounded" />
                <div className="w-1/2 h-3 bg-slate-200 rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="w-28 h-6 bg-slate-200 rounded" />
                  <div className="w-28 h-6 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="w-28 h-12 bg-slate-200 rounded self-end sm:self-center" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const renderMatchBadge = (hit: PartHit) => {
    switch (hit.matchedOn) {
      case "PART":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✓ Matched Part #: {hit.partNumber}
          </span>
        );
      case "OE":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 font-mono">
            ✓ Found OE #: {hit.matchedValue}
          </span>
        );
      case "EQUIVALENT":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 font-mono">
            ✓ Found Cross #: {hit.matchedValue}
          </span>
        );
      case "SUPERSEDES":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Supersedes: {hit.matchedValue}
          </span>
        );
      case "SUPERSEDED_BY":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Superseded By: {hit.matchedValue}
          </span>
        );
      case "NAME":
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
            Text Match
          </span>
        );
      default:
        return null;
    }
  };

  const renderStockBadge = (status?: string) => {
    if (status === "IN_STOCK") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          In Stock - Dubai Hub
        </span>
      );
    }
    if (status === "2_3_DAYS") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          2-3 Days GCC Dispatch
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
        Stock on Request
      </span>
    );
  };

  const renderFitmentBadge = (part: PartHit) => {
    if (part.fitmentStatus === "FITS_VEHICLE_VERIFIED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          ✓ Fits your vehicle (Verified 2+ Sources)
        </span>
      );
    }
    if (part.fitmentStatus === "FITS_VEHICLE_SINGLE") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          ✓ Fits your vehicle (Single Source)
        </span>
      );
    }
    if (part.fitmentStatus === "FITMENT_UNCONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
          ⚠️ Fitment unconfirmed for selected vehicle
        </span>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setSelectedPartId(part.id)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
      >
        🔍 Check fitment ({part.fitmentCount} vehicles)
      </button>
    );
  };

  const items = Array.isArray(data.items) ? data.items : [];
  const total = typeof data.total === "number" ? data.total : items.length;

  return (
    <div className="bg-white rounded-xl border border-cardBorder shadow-card p-5 sm:p-6 space-y-5">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-heading flex items-center gap-2">
            <span>{t.searchResultsTitle}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary">
              {total} {t.foundResults}
            </span>
          </h2>

          {data.q && (
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Searched:</span>
              <span className="font-mono font-bold text-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {data.q}
              </span>
              <span>• {total} item(s) found</span>
            </div>
          )}

          {/* Active Context Banner */}
          {data.context?.vehicle && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs text-primary font-medium">
              <span>🚗 {t.filterByVehicle}:</span>
              <span className="font-bold">
                {data.context.vehicle.manufacturer} {data.context.vehicle.model} -{" "}
                {data.context.vehicle.name}
              </span>
              {onClearFilterContext && (
                <button
                  type="button"
                  onClick={onClearFilterContext}
                  className="ms-1 hover:text-accent font-bold"
                  title="Remove vehicle filter"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-placeholder self-end sm:self-center font-mono">
          {data.tookMs || 0} ms
        </span>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="py-14 text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-heading">{t.noResultsFound}</h3>
          <p className="text-xs text-placeholder max-w-sm mx-auto">{t.noResultsHint}</p>
        </div>
      ) : (
        /* Results List */
        <div className="space-y-4">
          {items.map((item) => {
            if (item.kind === "part") {
              const part = item as PartHit;
              const imgUrl = part.primaryImage?.url || "/api/images/placeholder";

              return (
                <div
                  key={`part-${part.id}`}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-primary/60 hover:shadow-md transition-all bg-white flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5"
                >
                  {/* Part Image (Fixed Aspect Ratio with Placeholder Fallback) */}
                  <div
                    onClick={() => setSelectedPartId(part.id)}
                    className="w-full sm:w-32 h-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer group relative"
                  >
                    <img
                      src={imgUrl}
                      alt={part.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/api/images/placeholder";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>

                  {/* Part Information */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
                        {part.brand.name}
                      </span>
                      <span className="text-sm font-bold font-mono text-primary">
                        {part.partNumber}
                      </span>
                      {renderMatchBadge(part)}
                      {renderStockBadge(part.price?.stockStatus)}
                    </div>

                    {/* Prominent Matched Number Callout if matched on OE or Cross Reference */}
                    {part.matchedValue && part.matchedValue !== part.partNumber && (
                      <div className="flex items-center gap-2 py-1 px-2.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                        <span className="text-xs text-blue-900 font-semibold">Matched Number:</span>
                        <span className="font-mono font-bold text-xs text-primary bg-white px-2 py-0.5 rounded border border-blue-200 shadow-xs">
                          {part.matchedValue}
                        </span>
                        <span className="text-[11px] text-blue-700 font-medium hidden sm:inline">
                          ({part.matchedOn === "OE" ? "Genuine OE Interchange" : "Competitor Cross Reference"})
                        </span>
                      </div>
                    )}

                    <h4
                      onClick={() => setSelectedPartId(part.id)}
                      className="text-sm sm:text-base font-bold text-heading hover:text-primary cursor-pointer transition-colors"
                    >
                      {locale === "ar" && part.nameAr ? part.nameAr : part.name}
                    </h4>

                    {/* Groups breadcrumb */}
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span>
                        {locale === "ar" && part.assemblyGroup?.nameAr
                          ? part.assemblyGroup.nameAr
                          : part.assemblyGroup?.name || "General Auto Parts"}
                      </span>
                      {part.productGroup && (
                        <>
                          <span>›</span>
                          <span className="font-medium text-slate-700">
                            {locale === "ar" && part.productGroup?.nameAr
                              ? part.productGroup.nameAr
                              : part.productGroup?.name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* OE Equivalents & Crosses pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      {part.oeNumbers && part.oeNumbers.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <span className="font-semibold">{t.oeNumbers}:</span>
                          <span className="font-mono">
                            {part.oeNumbers.slice(0, 2).map((o) => o.number).join(", ")}
                            {part.oeNumbers.length > 2 && ` (+${part.oeNumbers.length - 2})`}
                          </span>
                        </div>
                      )}

                      {part.crossReferences && part.crossReferences.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <span className="font-semibold">{t.crossReferences}:</span>
                          <span className="font-mono">
                            {part.crossReferences
                              .slice(0, 2)
                              .map((c) => `${c.brandName} ${c.number}`)
                              .join(", ")}
                            {part.crossReferences.length > 2 &&
                              ` (+${part.crossReferences.length - 2})`}
                          </span>
                        </div>
                      )}

                      {/* Fitment badge */}
                      {renderFitmentBadge(part)}

                      {/* Source attribution badge */}
                      {part.sources && part.sources.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                          Source: {part.sources.map((s) => s.providerName).join(" • ")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Section */}
                  <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-start md:text-end">
                      {part.price?.sellPriceAed !== null && part.price?.sellPriceAed !== undefined ? (
                        <div>
                          <div className="text-lg sm:text-xl font-black text-heading">
                            AED {part.price.sellPriceAed.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {part.price.vatLabel || "incl. 5% VAT"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-slate-600">
                          Price on Request
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setSelectedPartId(part.id)}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm text-center"
                      >
                        {t.viewDetails}
                      </button>
                      <Link
                        href={`/tecdoc?tab=crosses&q=${encodeURIComponent(part.partNumber)}`}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 transition-colors text-center whitespace-nowrap flex items-center justify-center gap-1"
                      >
                        <span>⚡</span>
                        <span>TecDoc Studio</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.kind === "vehicle") {
              const v = item as VehicleHit;
              return (
                <div
                  key={`vehicle-${v.id}`}
                  className="p-4 rounded-lg border border-slate-200 hover:border-primary/60 transition-all bg-white flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                        Vehicle
                      </span>
                      <h4 className="text-sm font-bold text-heading">{v.label}</h4>
                    </div>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      {v.vehicle.engineCode && <span>Engine: {v.vehicle.engineCode}</span>}
                      {v.vehicle.powerKw && <span>{v.vehicle.powerKw} kW</span>}
                      {v.vehicle.fuel && <span>{v.vehicle.fuel}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onSelectVehicle && (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectVehicle(
                            typeof v.id === "number"
                              ? v.id
                              : parseInt(String(v.id).replace(/\D/g, ""), 10) || 1
                          )
                        }
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary-light text-primary hover:bg-blue-100 transition-colors"
                      >
                        {v.partCount} Parts ↗
                      </button>
                    )}
                    <Link
                      href="/tecdoc?tab=vehicles"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                    >
                      🚗 Navigator
                    </Link>
                  </div>
                </div>
              );
            }

            if (item.kind === "brand" || item.kind === "productGroup" || item.kind === "assemblyGroup") {
              const ent = item as EntityHit;
              return (
                <div
                  key={`entity-${ent.kind}-${ent.id}`}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-primary/60 transition-all bg-white flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {ent.kind}
                    </span>
                    <span className="text-sm font-bold text-heading">
                      {locale === "ar" && ent.nameAr ? ent.nameAr : ent.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded">
                    {ent.partCount} parts
                  </span>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {data.totalPages > 1 && (
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => onPageChange(data.page - 1)}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← {t.previous}
          </button>

          <span className="text-xs text-slate-600 font-medium">
            {t.page} {data.page} {t.of} {data.totalPages}
          </span>

          <button
            type="button"
            disabled={data.page >= data.totalPages}
            onClick={() => onPageChange(data.page + 1)}
            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t.next} →
          </button>
        </div>
      )}

      {/* Part Detail Modal */}
      {selectedPartId && (
        <PartDetailModal
          partId={selectedPartId}
          onClose={() => setSelectedPartId(null)}
          onSelectPartId={(id) => setSelectedPartId(id)}
        />
      )}
    </div>
  );
}
