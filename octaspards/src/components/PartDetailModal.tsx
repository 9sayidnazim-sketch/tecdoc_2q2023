"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { PartDetail } from "@/lib/search";

interface PartDetailModalProps {
  partId: number | null;
  onClose: () => void;
  onSelectPartId?: (id: number) => void;
}

export function PartDetailModal({
  partId,
  onClose,
  onSelectPartId,
}: PartDetailModalProps) {
  const { t, locale } = useI18n();
  const [part, setPart] = useState<PartDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "oe" | "cross" | "vehicles">("specs");

  useEffect(() => {
    if (!partId) {
      setPart(null);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedImageIndex(0);

    fetch(`/api/parts/${partId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setPart(data))
      .catch((err) => {
        console.error("Failed to load part detail:", err);
        setError("Could not load part details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [partId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!partId) return null;

  const images = part?.images && part.images.length > 0 ? part.images : [{
    id: 0,
    url: "/api/images/placeholder",
    thumbnailUrl: "/api/images/placeholder",
    isPrimary: true,
    altText: "Part image placeholder",
  }];

  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-part-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-cardBorder max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                {part?.brand.name ?? "Brand"}
              </span>
              <span className="text-sm text-primary font-mono font-bold">
                {part?.partNumber ?? "..."}
              </span>
              {part?.price?.stockStatus === "IN_STOCK" && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ In Stock - Dubai Hub
                </span>
              )}
            </div>
            <h2 id="modal-part-title" className="text-lg sm:text-xl font-bold text-heading">
              {locale === "ar" && part?.nameAr ? part.nameAr : part?.name ?? t.loading}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label={t.close}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-xs text-placeholder">{t.loading}</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 text-sm font-medium">{error}</div>
          ) : part ? (
            <div className="space-y-6">
              {/* Product Top Section: Gallery & Purchase Information */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200">
                {/* Image Gallery */}
                <div className="md:col-span-5 flex flex-col items-center gap-3">
                  <div className="w-full h-48 sm:h-56 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                    <img
                      src={currentImage?.url || "/api/images/placeholder"}
                      alt={currentImage?.altText || part.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/api/images/placeholder";
                      }}
                    />
                  </div>

                  {/* Thumbnail Row */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-14 h-14 rounded border p-1 bg-white shrink-0 transition-all ${
                            selectedImageIndex === idx
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-slate-200 hover:border-slate-300 opacity-70"
                          }`}
                        >
                          <img
                            src={img.thumbnailUrl || img.url}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/api/images/placeholder";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing & Stock Details */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Category breadcrumb */}
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                      <span>{part.assemblyGroup?.name || "General"}</span>
                      {part.productGroup && (
                        <>
                          <span>›</span>
                          <span className="font-semibold text-slate-800">{part.productGroup.name}</span>
                        </>
                      )}
                    </div>

                    {/* Price in AED */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="text-xs text-slate-500 font-medium">UAE Retail Price</div>
                      {part.price?.sellPriceAed !== null && part.price?.sellPriceAed !== undefined ? (
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900">
                            AED {part.price.sellPriceAed.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {part.price.vatLabel || "incl. 5% VAT"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-base font-bold text-slate-700 mt-1">
                          Price on Request
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">Stock Availability:</span>
                        <span className="font-bold text-emerald-700">
                          {part.price?.stockStatus === "IN_STOCK"
                            ? "✓ In Stock - Dispatch from Dubai Logistics Hub (24-48 hrs)"
                            : "Standard Regional Delivery (2-3 business days)"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {part.description && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {part.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50/80 p-2.5 rounded-lg border border-blue-200/60">
                    <span>🛡️ Verified Genuine Hologram / OE Fitment Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-border flex items-center gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeTab === "specs"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t.specifications}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("oe")}
                  className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "oe"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{t.oeNumbers}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px]">
                    {part.oeNumbers?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("cross")}
                  className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "cross"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{t.crossReferences}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px]">
                    {part.crossReferences?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("vehicles")}
                  className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "vehicles"
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{t.fitsVehicles}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-primary text-[10px]">
                    {part.fitments?.length || 0}
                  </span>
                </button>
              </div>

              {/* Tab: Specs */}
              {activeTab === "specs" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(part.specs || {}).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No technical specs recorded.</p>
                  ) : (
                    Object.entries(part.specs).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                      >
                        <span className="text-slate-500 font-medium">{k}</span>
                        <span className="text-slate-900 font-bold">{String(v)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: OE Numbers */}
              {activeTab === "oe" && (
                <div className="space-y-2">
                  {!part.oeNumbers || part.oeNumbers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No OE numbers listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {part.oeNumbers.map((oe, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs shadow-2xs"
                        >
                          <span className="font-semibold text-slate-700">{oe.brandName} OE</span>
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {oe.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Cross References */}
              {activeTab === "cross" && (
                <div className="space-y-2">
                  {!part.crossReferences || part.crossReferences.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No cross references listed.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {part.crossReferences.map((cr, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-primary transition-colors shadow-2xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{cr.brandName}</span>
                            <span className="block text-[10px] text-slate-400 uppercase">
                              {cr.type}
                            </span>
                          </div>
                          {cr.partId && onSelectPartId ? (
                            <button
                              type="button"
                              onClick={() => onSelectPartId(cr.partId!)}
                              className="font-mono font-bold text-primary hover:underline bg-primary-light px-2 py-0.5 rounded"
                            >
                              {cr.number} ↗
                            </button>
                          ) : (
                            <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {cr.number}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Fitments (Vehicles with Confidence Badges) */}
              {activeTab === "vehicles" && (
                <div className="space-y-2 max-h-72 overflow-y-auto pe-1">
                  {!part.fitments || part.fitments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No vehicle fitments listed.</p>
                  ) : (
                    part.fitments.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 bg-white text-xs gap-2 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {f.make} {f.model}
                            </span>
                            {f.generation && (
                              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {f.generation}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                              {f.marketSpec}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {f.engine || "Standard Engine"} • {f.fuel || "Petrol"} • {f.body || "Chassis"}
                            {f.yearFrom && ` (${f.yearFrom} - ${f.yearTo || "present"})`}
                          </div>
                        </div>

                        {/* Fitment Confidence Badge */}
                        <div className="shrink-0">
                          {f.confidence === "VERIFIED" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Verified (2+ Sources)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              Single Source
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {part ? (
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <Link
                href={`/tecdoc?tab=crosses&q=${encodeURIComponent(part.partNumber)}`}
                onClick={onClose}
                className="font-semibold text-primary hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>🔄</span>
                <span>TecDoc Cross-References</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/tecdoc?tab=diagrams"
                onClick={onClose}
                className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>📐</span>
                <span>Assembly Diagrams</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/tecdoc?tab=sdk"
                onClick={onClose}
                className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
              >
                <span>💻</span>
                <span>Pegasus SDK</span>
              </Link>
            </div>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors w-full sm:w-auto"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
