"use client";

import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { ManufacturerChip } from "@/lib/types";

interface RecentSearchesProps {
  onSelectManufacturer: (manufacturerId: number, name: string) => void;
}

export function RecentSearches({ onSelectManufacturer }: RecentSearchesProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<ManufacturerChip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchRecents = (limit = 9) => {
    setLoading(true);
    fetch(`/api/recents?limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error("Failed to load recent searches:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecents(isExpanded ? 18 : 9);
  }, [isExpanded]);

  const handleBrandClick = (m: ManufacturerChip) => {
    // Record click to user recents
    fetch("/api/recents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ manufacturerId: m.id }),
    })
      .then(() => fetchRecents(isExpanded ? 18 : 9))
      .catch(console.error);

    onSelectManufacturer(m.id, m.name);
  };

  // Helper to extract clean initials or iconic monogram for circular badge
  const getBadgeInitials = (name: string) => {
    if (name.includes("Mercedes")) return "MB";
    if (name.includes("Volkswagen")) return "VW";
    if (name.length <= 4) return name.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-cardBorder shadow-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xs sm:text-sm font-bold text-heading">
            {t.recentSearchesTitle}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
        >
          <span>{isExpanded ? t.showLess : t.loadMore}</span>
          <svg
            className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center gap-3 overflow-x-auto py-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-14 h-14 rounded-full skeleton-shimmer"></div>
              <div className="w-10 h-2 rounded skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4 py-1">
          {items.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleBrandClick(brand)}
              className="flex flex-col items-center gap-1.5 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-1 transition-transform active:scale-95 text-center"
              title={`Filter by ${brand.name}`}
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 flex items-center justify-center font-black text-sm sm:text-base shadow-sm transition-all group-hover:border-primary group-hover:shadow-md"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: brand.color || "#1F4FE0",
                }}
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors group-hover:bg-slate-50"
                  style={{ border: `1.5px solid ${brand.color || "#1F4FE0"}` }}
                >
                  <span className="tracking-tighter font-extrabold text-[12px] sm:text-[13px]">
                    {getBadgeInitials(brand.name)}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 group-hover:text-primary truncate max-w-[80px]">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
