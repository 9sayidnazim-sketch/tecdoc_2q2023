"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ar";

export interface Translations {
  // Navigation
  homePage: string;
  productsAndSolutions: string;
  catalogues: string;
  careers: string;
  newsletter: string;
  feedback: string;
  contactUs: string;
  aboutUs: string;

  // Header & Global Search
  searchPlaceholder: string;
  numberSearch: string;
  vehicleSearch: string;
  brandSearch: string;
  exactSearch: string;
  searchButtonAria: string;
  userAccount: string;
  country: string;
  language: string;

  // Find Parts Card
  findPartsTitle: string;
  findPartsSubtitle: string;
  vehicleSelection: string;
  manufacturer: string;
  modelType: string;
  type: string;
  selectManufacturer: string;
  selectModel: string;
  selectType: string;
  brandAndProductGroup: string;
  brand: string;
  productGroup: string;
  assemblyGroup: string;
  allBrands: string;
  allProductGroups: string;
  allAssemblyGroups: string;
  findPartsButton: string;
  resetFilters: string;

  // Recent Searches
  recentSearchesTitle: string;
  loadMore: string;
  showLess: string;

  // Search Results
  searchResultsTitle: string;
  foundResults: string;
  noResultsFound: string;
  noResultsHint: string;
  filterByVehicle: string;
  matchedOn: string;
  fitmentCount: string;
  oeNumbers: string;
  crossReferences: string;
  fitsVehicles: string;
  viewDetails: string;
  page: string;
  of: string;
  previous: string;
  next: string;

  // Part Details Modal / Page
  partDetails: string;
  specifications: string;
  compatibilityList: string;
  supersededBy: string;
  supersedes: string;
  equivalent: string;
  close: string;

  // Admin / Promo
  promotions: string;
  adminBanners: string;
  loading: string;
  error: string;
}

const translations: Record<Locale, Translations> = {
  en: {
    homePage: "Home Page",
    productsAndSolutions: "Products & Solutions",
    catalogues: "Catalogues",
    careers: "Careers",
    newsletter: "Newsletter",
    feedback: "Feedback",
    contactUs: "Contact Us",
    aboutUs: "About us",

    searchPlaceholder: "OE number, Part number, Cross reference",
    numberSearch: "Number search",
    vehicleSearch: "Vehicle search",
    brandSearch: "Brand search",
    exactSearch: "Exact search",
    searchButtonAria: "Search parts catalog",
    userAccount: "User account",
    country: "Country",
    language: "Language",

    findPartsTitle: "Find Parts",
    findPartsSubtitle: "Search by vehicle specification or component classification",
    vehicleSelection: "Vehicle",
    manufacturer: "Manufacturer",
    modelType: "Model type",
    type: "Type",
    selectManufacturer: "Select Manufacturer...",
    selectModel: "Select Model type...",
    selectType: "Select Engine / Type...",
    brandAndProductGroup: "Brand and Product group",
    brand: "Brand",
    productGroup: "Product group",
    assemblyGroup: "Assembly Group",
    allBrands: "All Brands...",
    allProductGroups: "All Product Groups...",
    allAssemblyGroups: "All Assembly Groups...",
    findPartsButton: "Find parts",
    resetFilters: "Clear",

    recentSearchesTitle: "Recent search",
    loadMore: "Load More",
    showLess: "Show Less",

    searchResultsTitle: "Search Results",
    foundResults: "found results",
    noResultsFound: "No matching parts found",
    noResultsHint: "Try adjusting your search query, checking spelling, or clearing filters.",
    filterByVehicle: "Filtered by vehicle",
    matchedOn: "Matched on",
    fitmentCount: "compatible vehicles",
    oeNumbers: "OE Numbers",
    crossReferences: "Cross References",
    fitsVehicles: "Compatible Vehicles",
    viewDetails: "View Details",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",

    partDetails: "Part Details",
    specifications: "Technical Specifications",
    compatibilityList: "Vehicle Fitment List",
    supersededBy: "Superseded By",
    supersedes: "Supersedes",
    equivalent: "Equivalent Cross Reference",
    close: "Close",

    promotions: "Featured Highlights",
    adminBanners: "Manage Banners",
    loading: "Loading...",
    error: "An error occurred while loading data.",
  },
  ar: {
    homePage: "الرئيسية",
    productsAndSolutions: "المنتجات والحلول",
    catalogues: "الكتالوجات",
    careers: "الوظائف",
    newsletter: "النشرة البريدية",
    feedback: "الآراء والمقترحات",
    contactUs: "اتصل بنا",
    aboutUs: "من نحن",

    searchPlaceholder: "رقم القطعة الأصلي، رقم المنتج، أو البديل التجاري",
    numberSearch: "بحث بالأرقام",
    vehicleSearch: "بحث بالمركبة",
    brandSearch: "بحث بالمصنع",
    exactSearch: "مطابقة تامة",
    searchButtonAria: "بحث في كتالوج قطع الغيار",
    userAccount: "حساب المستخدم",
    country: "الدولة",
    language: "اللغة",

    findPartsTitle: "البحث عن قطع الغيار",
    findPartsSubtitle: "ابحث وفق مواصفات السيارة أو تصنيف القطعة",
    vehicleSelection: "السيارة",
    manufacturer: "الشركة المصنعة",
    modelType: "الموديل والطراز",
    type: "نوع وسعة المحرك",
    selectManufacturer: "اختر الشركة المصنعة...",
    selectModel: "اختر الموديل...",
    selectType: "اختر نوع المحرك...",
    brandAndProductGroup: "المصنع ومجموعة المنتج",
    brand: "العلامة التجارية",
    productGroup: "مجموعة المنتج",
    assemblyGroup: "مجموعة التجميع الرئيسية",
    allBrands: "جميع العلامات التجارية...",
    allProductGroups: "جميع مجموعات المنتجات...",
    allAssemblyGroups: "جميع مجموعات التجميع...",
    findPartsButton: "بحث عن القطع",
    resetFilters: "إعادة تعيين",

    recentSearchesTitle: "عمليات البحث الأخيرة",
    loadMore: "عرض المزيد",
    showLess: "عرض أقل",

    searchResultsTitle: "نتائج البحث",
    foundResults: "نتيجة تم العثور عليها",
    noResultsFound: "لم يتم العثور على قطع مطابقة",
    noResultsHint: "يرجى التحقق من صحة الرقم أو تفريغ خيارات التصفية.",
    filterByVehicle: "مصفى حسب السيارة",
    matchedOn: "مطابق على",
    fitmentCount: "سيارة متوافقة",
    oeNumbers: "أرقام القطع الأصلية (OE)",
    crossReferences: "البدائل والتقاطعات",
    fitsVehicles: "السيارات المتوافقة",
    viewDetails: "تفاصيل القطعة",
    page: "صفحة",
    of: "من",
    previous: "السابق",
    next: "التالي",

    partDetails: "تفاصيل القطعة",
    specifications: "المواصفات الفنية",
    compatibilityList: "قائمة السيارات المتوافقة",
    supersededBy: "تم استبدالها بـ",
    supersedes: "تستبدل القطعة",
    equivalent: "بديل مكافئ",
    close: "إغلاق",

    promotions: "عروض وإعلانات مميزة",
    adminBanners: "إدارة الإعلانات",
    loading: "جاري التحميل...",
    error: "حدث خطأ أثناء تحميل البيانات.",
  },
};

interface I18nContextType {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  dir: "ltr",
  setLocale: () => undefined,
  toggleLocale: () => undefined,
  t: translations.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("oct_locale") as Locale | null;
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("oct_locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        dir,
        setLocale,
        toggleLocale,
        t: translations[locale],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
