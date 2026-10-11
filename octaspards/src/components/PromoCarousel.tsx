"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { BannerDto } from "@/lib/types";

export function PromoCarousel() {
  const { t, locale } = useI18n();
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      })
      .catch((err) => console.error("Failed to load banners:", err))
      .finally(() => setLoading(false));
  }, []);

  // Auto-advance carousel every 6 seconds unless hovered/paused
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-cardBorder shadow-card p-5 h-full min-h-[360px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <span className="text-xs text-placeholder">{t.loading}</span>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const current = banners[currentIndex] ?? banners[0];
  if (!current) return null;

  const title = locale === "ar" && current.titleAr ? current.titleAr : current.title;
  const subtitle =
    locale === "ar" && current.subtitleAr ? current.subtitleAr : current.subtitle;

  return (
    <div
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl border border-cardBorder shadow-card overflow-hidden h-full min-h-[380px] flex flex-col justify-between group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label={t.promotions}
    >
      {/* Background Graphic / Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -end-10 -bottom-10 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute -start-10 -top-10 w-64 h-64 rounded-full bg-accent blur-3xl"></div>
      </div>

      {/* Decorative Technical Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Slide Content */}
      <div className="relative z-10 p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-accent backdrop-blur-sm">
            <span>★</span>
            <span>{t.promotions}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Link & Indicators */}
        <div className="pt-6 flex items-center justify-between">
          {current.linkUrl ? (
            <Link
              href={current.linkUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
            >
              <span>{t.viewDetails}</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1.75 1.75 0 012.414 0l6 6a1.75 1.75 0 010 2.414l-6 6a1.75 1.75 0 01-2.414-2.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1.75 1.75 0 010-2.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          ) : (
            <div></div>
          )}

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? "w-6 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {banners.length > 1 && (
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center pointer-events-auto backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center pointer-events-auto backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
