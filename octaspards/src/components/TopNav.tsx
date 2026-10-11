"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

function TopNavInner() {
  const { t } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const isTecDoc = pathname === "/tecdoc";

  const navItems = [
    { label: "Parts Finder", href: "/", active: isHome },
    { label: "🚗 Vehicle Navigator", href: "/tecdoc?tab=vehicles", active: isTecDoc && currentTab === "vehicles" },
    { label: "⚡ All APIs Search", href: "/tecdoc?tab=all_apis", active: isTecDoc && (currentTab === "all_apis" || (!currentTab && !searchParams.get("art"))) },
    { label: "🔍 VIN & Plates", href: "/tecdoc?tab=vin", active: isTecDoc && currentTab === "vin" },
    { label: "📐 Diagrams", href: "/tecdoc?tab=diagrams", active: isTecDoc && currentTab === "diagrams" },
    { label: "🔄 Cross-References", href: "/tecdoc?tab=crosses", active: isTecDoc && currentTab === "crosses" },
    { label: "📊 84 Tables Schema", href: "/tecdoc?tab=schema", active: isTecDoc && currentTab === "schema" },
    { label: "⚡ SQL Workbench", href: "/tecdoc?tab=workbench", active: isTecDoc && currentTab === "workbench" },
    { label: "💻 Pegasus SDK", href: "/tecdoc?tab=sdk", active: isTecDoc && currentTab === "sdk" },
    { label: "📰 Autodoc Feed", href: "/tecdoc?tab=autodoc", active: isTecDoc && currentTab === "autodoc" },
  ];

  return (
    <nav className="border-b border-border bg-white text-sm" aria-label="Main Navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1.5">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                  item.active
                    ? "bg-primary text-white shadow-sm"
                    : "text-heading hover:bg-slate-100 hover:text-primary"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Quick link to admin banners */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-placeholder">
            <Link
              href="/tecdoc"
              className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-primary hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <span>⚡ TecDoc Studio</span>
            </Link>

            <Link
              href="/admin/banners"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>{t.adminBanners}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold text-primary">
              {isTecDoc ? "TecDoc Studio" : "Octaspards"}
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-600 hover:text-heading hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-2 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  item.active ? "bg-primary text-white" : "text-heading hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/banners"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {t.adminBanners}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export function TopNav() {
  return (
    <React.Suspense fallback={<nav className="border-b border-border bg-white h-12" aria-label="Loading Navigation" />}>
      <TopNavInner />
    </React.Suspense>
  );
}
