"use client";

import React, { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SearchDropdown } from "./SearchDropdown";
import type { CatalogOption } from "@/lib/types";

export interface FindPartsFilterState {
  manufacturerId?: number;
  modelId?: number;
  vehicleTypeId?: number;
  brandId?: number;
  productGroupId?: number;
  assemblyGroupId?: number;
}

interface FindPartsCardProps {
  onFindParts: (filters: FindPartsFilterState) => void;
  initialFilters?: FindPartsFilterState;
}

export function FindPartsCard({ onFindParts, initialFilters }: FindPartsCardProps) {
  const { t } = useI18n();

  // Selected state
  const [manufacturerId, setManufacturerId] = useState<number | undefined>(
    initialFilters?.manufacturerId
  );
  const [modelId, setModelId] = useState<number | undefined>(initialFilters?.modelId);
  const [vehicleTypeId, setVehicleTypeId] = useState<number | undefined>(
    initialFilters?.vehicleTypeId
  );
  const [brandId, setBrandId] = useState<number | undefined>(initialFilters?.brandId);
  const [productGroupId, setProductGroupId] = useState<number | undefined>(
    initialFilters?.productGroupId
  );
  const [assemblyGroupId, setAssemblyGroupId] = useState<number | undefined>(
    initialFilters?.assemblyGroupId
  );

  // Options lists
  const [manufacturers, setManufacturers] = useState<CatalogOption[]>([]);
  const [models, setModels] = useState<CatalogOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<CatalogOption[]>([]);
  const [brands, setBrands] = useState<CatalogOption[]>([]);
  const [productGroups, setProductGroups] = useState<CatalogOption[]>([]);
  const [assemblyGroups, setAssemblyGroups] = useState<CatalogOption[]>([]);

  // Loading states
  const [loadingMf, setLoadingMf] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // 1. Initial catalog load (Manufacturers, Brands, Assembly Groups, Product Groups)
  useEffect(() => {
    async function loadInitial() {
      setLoadingMf(true);
      setLoadingBrands(true);
      setLoadingGroups(true);
      try {
        const [mfRes, bRes, aRes, pgRes] = await Promise.all([
          fetch("/api/catalog?kind=manufacturers").then((r) => r.json()),
          fetch("/api/catalog?kind=brands").then((r) => r.json()),
          fetch("/api/catalog?kind=assembly-groups").then((r) => r.json()),
          fetch("/api/catalog?kind=product-groups").then((r) => r.json()),
        ]);
        if (Array.isArray(mfRes)) setManufacturers(mfRes);
        if (Array.isArray(bRes)) setBrands(bRes);
        if (Array.isArray(aRes)) setAssemblyGroups(aRes);
        if (Array.isArray(pgRes)) setProductGroups(pgRes);
      } catch (err) {
        console.error("Failed to load initial catalog options:", err);
      } finally {
        setLoadingMf(false);
        setLoadingBrands(false);
        setLoadingGroups(false);
      }
    }
    loadInitial();
  }, []);

  // 2. Cascade: When Manufacturer changes -> fetch Models
  useEffect(() => {
    if (!manufacturerId) {
      setModels([]);
      setModelId(undefined);
      setVehicleTypes([]);
      setVehicleTypeId(undefined);
      return;
    }

    setLoadingModels(true);
    fetch(`/api/catalog?kind=models&manufacturerId=${manufacturerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setModels(data);
      })
      .catch((err) => console.error("Failed to load models:", err))
      .finally(() => setLoadingModels(false));
  }, [manufacturerId]);

  // 3. Cascade: When Model changes -> fetch Vehicle Types
  useEffect(() => {
    if (!modelId) {
      setVehicleTypes([]);
      setVehicleTypeId(undefined);
      return;
    }

    setLoadingTypes(true);
    fetch(`/api/catalog?kind=types&modelId=${modelId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVehicleTypes(data);
      })
      .catch((err) => console.error("Failed to load vehicle types:", err))
      .finally(() => setLoadingTypes(false));
  }, [modelId]);

  // 4. Cascade: When Assembly Group changes -> filter Product Groups
  useEffect(() => {
    if (assemblyGroupId) {
      fetch(`/api/catalog?kind=product-groups&assemblyGroupId=${assemblyGroupId}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setProductGroups(data);
        })
        .catch(console.error);
    } else {
      fetch(`/api/catalog?kind=product-groups`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setProductGroups(data);
        })
        .catch(console.error);
    }
  }, [assemblyGroupId]);

  // Valid selection check: user must select at least one filter criterion
  const hasValidSelection = Boolean(
    manufacturerId ||
      modelId ||
      vehicleTypeId ||
      brandId ||
      productGroupId ||
      assemblyGroupId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasValidSelection) {
      // Record recent manufacturer search if selected
      if (manufacturerId) {
        fetch("/api/recents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ manufacturerId }),
        }).catch(console.error);
      }

      onFindParts({
        manufacturerId,
        modelId,
        vehicleTypeId,
        brandId,
        productGroupId,
        assemblyGroupId,
      });
    }
  };

  const handleReset = () => {
    setManufacturerId(undefined);
    setModelId(undefined);
    setVehicleTypeId(undefined);
    setBrandId(undefined);
    setProductGroupId(undefined);
    setAssemblyGroupId(undefined);
  };

  return (
    <div className="bg-white rounded-xl border border-cardBorder shadow-card p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Title & Subtitle */}
        <div className="border-b border-slate-100 pb-3.5 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-heading flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
              {t.findPartsTitle}
            </h2>
            <p className="text-xs text-placeholder mt-0.5">{t.findPartsSubtitle}</p>
          </div>
          {hasValidSelection && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-accent font-medium transition-colors"
            >
              {t.resetFilters}
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Vehicle Cascading Dropdowns */}
          <div>
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. {t.vehicleSelection}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Manufacturer */}
              <SearchDropdown
                id="select-manufacturer"
                label={t.manufacturer}
                placeholder={t.selectManufacturer}
                options={manufacturers}
                value={manufacturerId}
                onChange={(val) => {
                  setManufacturerId(val);
                  setModelId(undefined);
                  setVehicleTypeId(undefined);
                }}
                loading={loadingMf}
              />

              {/* Model (disabled until Manufacturer selected) */}
              <SearchDropdown
                id="select-model"
                label={t.modelType}
                placeholder={t.selectModel}
                options={models}
                value={modelId}
                onChange={(val) => {
                  setModelId(val);
                  setVehicleTypeId(undefined);
                }}
                disabled={!manufacturerId}
                loading={loadingModels}
              />

              {/* Type / Engine (disabled until Model selected) */}
              <SearchDropdown
                id="select-type"
                label={t.type}
                placeholder={t.selectType}
                options={vehicleTypes}
                value={vehicleTypeId}
                onChange={setVehicleTypeId}
                disabled={!modelId}
                loading={loadingTypes}
              />
            </div>
          </div>

          {/* Section 2: Brand and Product group side-by-side */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. {t.brandAndProductGroup}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SearchDropdown
                id="select-brand"
                label={t.brand}
                placeholder={t.allBrands}
                options={brands}
                value={brandId}
                onChange={setBrandId}
                loading={loadingBrands}
              />

              <SearchDropdown
                id="select-product-group"
                label={t.productGroup}
                placeholder={t.allProductGroups}
                options={productGroups}
                value={productGroupId}
                onChange={setProductGroupId}
                loading={loadingGroups}
              />
            </div>
          </div>

          {/* Section 3: Assembly Group */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              3. {t.assemblyGroup}
            </span>
            <SearchDropdown
              id="select-assembly-group"
              label={t.assemblyGroup}
              placeholder={t.allAssemblyGroups}
              options={assemblyGroups}
              value={assemblyGroupId}
              onChange={(val) => {
                setAssemblyGroupId(val);
                setProductGroupId(undefined);
              }}
            />
          </div>

          {/* Action button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!hasValidSelection}
              aria-disabled={!hasValidSelection}
              className={`w-full h-11 px-6 rounded-lg text-sm font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
                hasValidSelection
                  ? "bg-primary hover:bg-primary-hover active:scale-[0.99] cursor-pointer shadow-blue-500/20"
                  : "bg-primary-disabled cursor-not-allowed opacity-90"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>{t.findPartsButton}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
