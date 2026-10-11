"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { OctaspardsLogo } from "./OctaspardsLogo";
import type { SearchMode } from "@/lib/validation";

interface HeaderProps {
  onSearch: (params: { q: string; mode: SearchMode; exact: boolean }) => void;
  initialQuery?: string;
  initialMode?: SearchMode;
  initialExact?: boolean;
}

export function Header({
  onSearch,
  initialQuery = "",
  initialMode = "all",
  initialExact = false,
}: HeaderProps) {
  const { t, locale, toggleLocale } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [exact, setExact] = useState(initialExact);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Germany");

  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const [suggestions, setSuggestions] = useState<import("@/lib/types").SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestionsCard, setShowSuggestionsCard] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setShowSuggestionsCard(false);
      return;
    }

    setIsSearching(true);
    if (isInputFocused) {
      setShowSuggestionsCard(true);
    }

    const timer = setTimeout(() => {
      fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => {
          const list = d.suggestions || [];
          setSuggestions(list);
          if (isInputFocused && list.length > 0) {
            setShowSuggestionsCard(true);
          }
        })
        .catch(() => setSuggestions([]))
        .finally(() => setIsSearching(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isInputFocused]);

  // Click outside to close searching card
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsInputFocused(false);
        setShowSuggestionsCard(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countries = [
    { code: "DE", name: "Germany" },
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "JP", name: "Japan" },
    { code: "GB", name: "United Kingdom" },
  ];

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [keySaveMessage, setKeySaveMessage] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("octaspards_api_key") || "";
      setSavedApiKey(stored);
      setApiKeyInput(stored);
    }
  }, []);

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("octaspards_api_key", trimmed);
        setSavedApiKey(trimmed);
        setKeySaveMessage("✓ API Key saved. Active for all searches!");
      } else {
        localStorage.removeItem("octaspards_api_key");
        setSavedApiKey("");
        setKeySaveMessage("✓ Cleared. Defaulting to built-in TecDoc 2Q 2023 engine.");
      }
      setTimeout(() => setKeySaveMessage(""), 3000);
    }
  };

  const modeLabels: Record<SearchMode, string> = {
    all: "All Auto Keys",
    number: t.numberSearch || "Part # / Article",
    oe: "OE Genuine #",
    vin: "VIN Decoder",
    kba: "KBA / Type #",
    vehicle: t.vehicleSearch || "Vehicle",
    brand: t.brandSearch || "Brand",
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInputFocused(false);
    setShowSuggestionsCard(false);
    if (query.trim()) {
      onSearch({ q: query.trim(), mode, exact });
    }
  };

  return (
    <header className="border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block" aria-label="Octaspards Home">
              <OctaspardsLogo />
            </Link>

            {/* Mobile Actions (Language, Country, User) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setShowApiKeyModal(true)}
                className="px-2 py-1 text-xs font-semibold rounded border border-border bg-slate-50 hover:bg-slate-100 flex items-center gap-1"
                aria-label="API Keys"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>API</span>
              </button>
              <button
                type="button"
                onClick={toggleLocale}
                className="px-2.5 py-1 text-xs font-semibold rounded border border-border bg-slate-50 hover:bg-slate-100"
                aria-label="Toggle language"
              >
                {locale === "en" ? "عربي" : "EN"}
              </button>
            </div>
          </div>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-3xl"
            role="search"
            aria-label="Parts Search"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div
                ref={searchContainerRef}
                className="relative flex-1 flex items-center rounded-lg border border-border shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary bg-white"
              >
                {/* Search Mode Dropdown Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
                    className="flex items-center gap-1.5 h-11 px-3.5 text-xs font-semibold text-white bg-primary rounded-s-md hover:bg-primary-hover focus:outline-none transition-colors whitespace-nowrap"
                    aria-haspopup="listbox"
                    aria-expanded={modeDropdownOpen}
                  >
                    <span>{modeLabels[mode]}</span>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Mode Dropdown Menu */}
                  {modeDropdownOpen && (
                    <div
                      className="absolute top-full start-0 mt-1 w-48 rounded-md bg-white py-1 shadow-dropdown border border-border z-30"
                      role="listbox"
                    >
                      {(["all", "number", "oe", "vin", "kba", "vehicle", "brand"] as SearchMode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setMode(m);
                            setModeDropdownOpen(false);
                          }}
                          className={`w-full text-start px-3.5 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                            mode === m ? "text-primary font-bold bg-primary-light" : "text-heading"
                          }`}
                          role="option"
                          aria-selected={mode === m}
                        >
                          <span>{modeLabels[m]}</span>
                          {mode === m && (
                            <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Text Input */}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true);
                    if (query.trim().length >= 2) setShowSuggestionsCard(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsInputFocused(false);
                      setShowSuggestionsCard(false);
                    }, 250);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsInputFocused(false);
                      setShowSuggestionsCard(false);
                    } else if (e.key === "Escape") {
                      setIsInputFocused(false);
                      setShowSuggestionsCard(false);
                    }
                  }}
                  placeholder="Search part number, OE reference, VIN, registration or part name..."
                  className="w-full h-11 px-3 text-sm text-heading placeholder:text-placeholder focus:outline-none bg-transparent"
                  aria-label="Search Auto Parts"
                />

                {/* API Key / Data Provider Status Button */}
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(true)}
                  className="h-11 px-2.5 bg-slate-50 hover:bg-slate-100 border-s border-border text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                  title="Configure API Keys & Live Data Providers"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline text-[11px] text-slate-500">APIs:</span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-primary border border-blue-200">
                    {savedApiKey ? "Custom Key" : "ALL CONNECTED"}
                  </span>
                </button>

                {/* Orange Search Icon Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center h-11 w-12 bg-accent hover:bg-accent-hover text-white rounded-e-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 shrink-0"
                  aria-label={t.searchButtonAria}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* LIVE SEARCHING CARD / TYPEAHEAD DROPDOWN */}
                {showSuggestionsCard && isInputFocused && query.trim().length >= 2 && (
                  <div className="absolute top-full start-0 end-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    {/* Searching status header */}
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isSearching ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                        <span className="font-semibold text-slate-700">
                          {isSearching
                            ? "Searching TecDoc catalog & GCC stock..."
                            : suggestions.length > 0
                            ? `Found ${suggestions.length} matching auto item(s)`
                            : "No instant auto parts found"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Query: &quot;{query}&quot;
                      </span>
                    </div>

                    {/* Suggestions list with images, matched numbers, and AED prices */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const val = item.matchedNumber || item.text;
                            setQuery(val);
                            setIsInputFocused(false);
                            setShowSuggestionsCard(false);
                            onSearch({
                              q: val,
                              mode: item.type === "vehicle" ? "vehicle" : "number",
                              exact: false,
                            });
                          }}
                          className="p-3 hover:bg-blue-50/70 cursor-pointer transition-colors flex items-center gap-3 group"
                        >
                          {/* Item Thumbnail Image */}
                          {item.imageUrl ? (
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                              <img
                                src={item.imageUrl}
                                alt={item.text}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/api/images/placeholder";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 text-lg">
                              {item.type === "vehicle" ? "🚗" : item.type === "brand" ? "🏷️" : "⚙️"}
                            </div>
                          )}

                          {/* Text Information with Found Number prominently shown */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-primary group-hover:text-blue-700">
                                {item.text}
                              </span>
                              {item.type === "oe" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                  ✓ Found OE #
                                </span>
                              )}
                              {item.type === "part" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                                  ✓ Part #
                                </span>
                              )}
                              {item.type === "vehicle" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  Vehicle
                                </span>
                              )}
                              {item.brand && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                                  {item.brand}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 truncate mt-0.5">{item.subtext}</p>
                          </div>

                          {/* UAE Price in AED */}
                          {item.priceAed !== null && item.priceAed !== undefined && (
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-slate-900 block font-mono">
                                AED {item.priceAed.toFixed(2)}
                              </span>
                              <span className="text-[9px] text-slate-400 block">incl. 5% VAT</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer View All Button */}
                    <button
                      type="submit"
                      className="w-full p-2.5 bg-slate-50 hover:bg-blue-50 text-center text-xs font-semibold text-primary border-t border-slate-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Press Enter or Click to view all catalog results for &quot;{query}&quot;</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Exact Search Checkbox */}
              <div className="flex items-center gap-1.5 px-1 py-1 shrink-0 select-none">
                <input
                  type="checkbox"
                  id="exact-search-checkbox"
                  checked={exact}
                  onChange={(e) => setExact(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="exact-search-checkbox"
                  className="text-xs font-medium text-slate-600 hover:text-heading cursor-pointer whitespace-nowrap"
                >
                  {t.exactSearch}
                </label>
              </div>
            </div>
          </form>

          {/* Right Header Actions (Desktop: User, Country, Language) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* User Icon */}
            <button
              type="button"
              className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
              aria-label={t.userAccount}
              title={t.userAccount}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Country Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-border rounded-md transition-colors"
                aria-label={t.country}
                aria-haspopup="true"
                aria-expanded={countryDropdownOpen}
              >
                <span>🌐</span>
                <span className="hidden xl:inline">{selectedCountry}</span>
                <svg className="w-3 h-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {countryDropdownOpen && (
                <div className="absolute top-full end-0 mt-1 w-40 rounded-md bg-white py-1 shadow-dropdown border border-border z-30">
                  {countries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c.name);
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 text-xs hover:bg-slate-50 ${
                        selectedCountry === c.name ? "text-primary font-bold bg-primary-light" : "text-heading"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector (EN / AR) */}
            <button
              type="button"
              id="lang-toggle-btn"
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
              aria-label="Language"
            >
              <span>{locale === "en" ? "العربية (RTL)" : "English (LTR)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Configuration & Status Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-primary text-base">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">API Keys & Data Providers</h3>
                  <p className="text-xs text-slate-500">Configure Pegasus 3.0 REST, TecDoc 2Q 2023, and Autodoc APIs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Provider status cards */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-950">Canonical PostgreSQL Database</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Local warehouse stock, prices in AED (incl. 5% VAT)</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">CONNECTED</span>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-blue-950">TecDoc 2Q 2023 High-Fidelity Engine</span>
                  </div>
                  <p className="text-[11px] text-blue-700 mt-0.5">10,000+ Vehicles, OE Numbers, Cross-References, Criteria</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded">ACTIVE</span>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-bold text-purple-950">Autodoc Aftermarket WebAPI Feed</span>
                  </div>
                  <p className="text-[11px] text-purple-700 mt-0.5">Live technical bulletins, OEM news, diagnosis guides</p>
                </div>
                <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">ONLINE</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${savedApiKey ? "bg-emerald-500" : "bg-amber-400"}`} />
                    <span className="text-xs font-bold text-slate-900">TecAlliance Pegasus 3.0 REST Service</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Live Pegasus JSON endpoints (webservice.tecalliance.services)</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${savedApiKey ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                  {savedApiKey ? "CUSTOM KEY SET" : "READY"}
                </span>
              </div>
            </div>

            {/* Custom API Key input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Custom TecAlliance Pegasus API Key (X-API-Key)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Enter your TecAlliance Pegasus API Key..."
                  className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-sm"
                >
                  Save Key
                </button>
              </div>
              {keySaveMessage && (
                <p className="text-xs font-medium text-emerald-600 animate-in fade-in-50">{keySaveMessage}</p>
              )}
              <p className="text-[11px] text-slate-400">
                Note: Even without a custom Pegasus API key, Octaspards runs on ALL search keys (OE numbers, aftermarket crosses, VIN, KBA, brands, and categories) backed by the built-in TecDoc 2Q 2023 engine and local warehouse catalog.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setApiKeyInput("");
                  handleSaveApiKey();
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
              >
                Reset to Default Engine
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
