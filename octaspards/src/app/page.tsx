"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { Header } from "@/components/Header";
import { FindPartsCard, type FindPartsFilterState } from "@/components/FindPartsCard";
import { PromoCarousel } from "@/components/PromoCarousel";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchResults } from "@/components/SearchResults";
import { useI18n } from "@/lib/i18n";
import type { SearchMode } from "@/lib/validation";
import type { SearchResponse } from "@/lib/types";

function HomePageContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();

  // Search parameters
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [isExact, setIsExact] = useState(false);
  const [filters, setFilters] = useState<FindPartsFilterState>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Search results & loading
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Perform search query
  const executeSearch = React.useCallback(
    (params: {
      q?: string;
      mode?: SearchMode;
      exact?: boolean;
      filterState?: FindPartsFilterState;
      page?: number;
    }) => {
      const q = params.q !== undefined ? params.q : searchQuery;
      const mode = params.mode !== undefined ? params.mode : searchMode;
      const exact = params.exact !== undefined ? params.exact : isExact;
      const currentFilters = params.filterState !== undefined ? params.filterState : filters;
      const page = params.page !== undefined ? params.page : currentPage;

      setLoading(true);

      const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: "15",
        mode,
        exact: exact ? "true" : "false",
      });

      if (q.trim()) queryParams.set("q", q.trim());
      if (currentFilters.manufacturerId)
        queryParams.set("manufacturerId", String(currentFilters.manufacturerId));
      if (currentFilters.modelId)
        queryParams.set("modelId", String(currentFilters.modelId));
      if (currentFilters.vehicleTypeId)
        queryParams.set("vehicleTypeId", String(currentFilters.vehicleTypeId));
      if (currentFilters.brandId)
        queryParams.set("brandId", String(currentFilters.brandId));
      if (currentFilters.productGroupId)
        queryParams.set("productGroupId", String(currentFilters.productGroupId));
      if (currentFilters.assemblyGroupId)
        queryParams.set("assemblyGroupId", String(currentFilters.assemblyGroupId));

      const storedApiKey =
        typeof window !== "undefined" ? localStorage.getItem("octaspards_api_key") : null;
      if (storedApiKey) {
        queryParams.set("apiKey", storedApiKey);
      }

      fetch(`/api/search?${queryParams.toString()}`, {
        headers: storedApiKey ? { "X-API-Key": storedApiKey } : undefined,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            setResults(data);
          } else {
            setResults({
              mode,
              q,
              exact,
              page,
              pageSize: 15,
              total: 0,
              totalPages: 1,
              tookMs: 0,
              items: [],
            });
          }
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setResults({
            mode,
            q,
            exact,
            page,
            pageSize: 15,
            total: 0,
            totalPages: 1,
            tookMs: 0,
            items: [],
          });
        })
        .finally(() => setLoading(false));
    },
    [searchQuery, searchMode, isExact, filters, currentPage]
  );

  // Run initial search on mount or when searchParams query changes
  useEffect(() => {
    const qFromUrl = searchParams?.get("q");
    if (qFromUrl) {
      setSearchQuery(qFromUrl);
      executeSearch({ q: qFromUrl, mode: "all", filterState: {}, page: 1 });
    } else {
      executeSearch({ q: "0 986", mode: "all", filterState: {}, page: 1 });
    }
  }, [searchParams, executeSearch]);

  const handleGlobalSearch = ({
    q,
    mode,
    exact,
  }: {
    q: string;
    mode: SearchMode;
    exact: boolean;
  }) => {
    setSearchQuery(q);
    setSearchMode(mode);
    setIsExact(exact);
    setFilters({}); // Unconstrain vehicle filter for global searches across all keys
    setCurrentPage(1);
    executeSearch({ q, mode, exact, filterState: {}, page: 1 });
  };

  const handleFindParts = (newFilters: FindPartsFilterState) => {
    setFilters(newFilters);
    setSearchQuery(""); // Clear text search when filtering by vehicle card
    setCurrentPage(1);
    executeSearch({ q: "", filterState: newFilters, page: 1 });
  };

  const handleSelectRecentManufacturer = (manufacturerId: number, _name: string) => {
    const updated = { manufacturerId };
    setFilters(updated);
    setSearchQuery("");
    setCurrentPage(1);
    executeSearch({ q: "", filterState: updated, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    executeSearch({ page: newPage });
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleClearFilterContext = () => {
    setFilters({});
    executeSearch({ filterState: {}, page: 1 });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Top Nav */}
      <TopNav />

      {/* 2. Header */}
      <Header
        onSearch={handleGlobalSearch}
        initialQuery={searchQuery}
        initialMode={searchMode}
        initialExact={isExact}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 w-full">
        {/* Top 2-Column Section: Find Parts Card (~2/3) + Promo Carousel (~1/3) */}
        <section
          aria-label="Parts Search and Featured Highlights"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          <div className="lg:col-span-8 flex flex-col">
            <FindPartsCard
              onFindParts={handleFindParts}
              initialFilters={filters}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col">
            <PromoCarousel />
          </div>
        </section>

        {/* TecDoc Integrated Technical Tools */}
        <section aria-label="TecDoc Engine Features" className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-sm border border-blue-900/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white uppercase tracking-wider">
                TecDoc 2Q 2023 Engine
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Integrated Technical Automotive Database & Engineering Studio
              </span>
            </div>
            <Link
              href="/tecdoc"
              className="text-xs text-accent hover:text-orange-400 font-semibold flex items-center gap-1 transition-colors"
            >
              Open Unified TecDoc Studio (All 10 Modules) →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-xs">
            <Link
              href="/tecdoc?tab=vehicles"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">🚗</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  Vehicles
                </span>
                <span className="text-[10px] text-slate-400 block">
                  5 Categories
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=vin"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">🔍</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  VIN Decoder
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ISO 3779 / 3780
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=diagrams"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">📐</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  Diagrams
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Interactive Hotspots
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=crosses"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">🔄</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  Cross-Ref
                </span>
                <span className="text-[10px] text-slate-400 block">
                  OE & Analogs
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=schema"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">📊</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  84 Tables
                </span>
                <span className="text-[10px] text-slate-400 block">
                  3NF Evolution
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=workbench"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">⚡</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  42 SQL
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Workbench
                </span>
              </div>
            </Link>

            <Link
              href="/tecdoc?tab=sdk"
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group"
            >
              <span className="text-base mb-1">💻</span>
              <div>
                <span className="font-bold block text-white group-hover:text-primary transition-colors">
                  Pegasus SDK
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Code Generator
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* 5. Recent Search Row */}
        <section aria-label={t.recentSearchesTitle}>
          <RecentSearches onSelectManufacturer={handleSelectRecentManufacturer} />
        </section>

        {/* Search Results Area */}
        <section aria-label={t.searchResultsTitle}>
          <SearchResults
            data={results}
            loading={loading}
            onPageChange={handlePageChange}
            onSelectVehicle={(vtId) => {
              const updated = { ...filters, vehicleTypeId: vtId };
              setFilters(updated);
              executeSearch({ filterState: updated, page: 1 });
            }}
            onClearFilterContext={handleClearFilterContext}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white text-xs text-slate-500 py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Octaspards</span>
            <span>•</span>
            <span>Automotive Spare-Parts Finder & Catalogue</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Version 1.0 (Production)</span>
            <span>•</span>
            <span>PostgreSQL Full-Text Search</span>
            <span>•</span>
            <span className="font-semibold text-primary uppercase">{locale}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <HomePageContent />
    </Suspense>
  );
}

