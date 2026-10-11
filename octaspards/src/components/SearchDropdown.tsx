"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CatalogOption } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface SearchDropdownProps {
  id: string;
  label: string;
  placeholder: string;
  options: CatalogOption[];
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  required?: boolean;
}

export function SearchDropdown({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  className = "",
}: SearchDropdownProps) {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setFilterText("");
      setHighlightedIndex(-1);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const selectedOption = options.find((o) => o.id === value);

  // Filter options based on user typing
  const filteredOptions = options.filter((opt) => {
    if (!filterText.trim()) return true;
    const q = (filterText || "").toLowerCase();
    const lEn = (opt.label || "").toLowerCase();
    const lAr = (opt.labelAr || "").toLowerCase();
    const hint = (opt.hint || "").toLowerCase();
    return lEn.includes(q) || lAr.includes(q) || hint.includes(q);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].id);
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const getDisplayLabel = (opt: CatalogOption) => {
    if (locale === "ar" && opt.labelAr) {
      return opt.labelAr;
    }
    return opt.label;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>

      {/* Button trigger */}
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        className={`w-full h-10 px-3 text-start text-xs rounded-md border flex items-center justify-between transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
          disabled
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-heading border-border hover:border-slate-400 cursor-pointer shadow-sm"
        }`}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="font-medium text-slate-900">
              {getDisplayLabel(selectedOption)}
            </span>
          ) : (
            <span className="text-placeholder">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1 ms-2 shrink-0">
          {loading && (
            <svg
              className="animate-spin h-3.5 w-3.5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          {!disabled && selectedOption && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded"
              title="Clear selection"
              aria-label={`Clear ${label}`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </span>
          )}

          <svg
            className={`h-4 w-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Floating Popover */}
      {isOpen && !disabled && (
        <div className="absolute top-full start-0 mt-1 w-full rounded-md bg-white shadow-dropdown border border-border z-40 py-1.5 animate-in fade-in-50 duration-100">
          {/* Quick search input if more than 6 options */}
          {options.length > 5 && (
            <div className="px-2 pb-1.5 border-b border-slate-100">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`Search ${label}...`}
                  className="w-full h-8 ps-7 pe-2 text-xs rounded border border-slate-200 focus:outline-none focus:border-primary"
                  aria-label={`Search inside ${label}`}
                />
                <svg
                  className="w-3.5 h-3.5 absolute start-2 top-2.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Listbox */}
          <ul
            ref={listboxRef}
            role="listbox"
            tabIndex={-1}
            className="max-h-56 overflow-y-auto py-1 text-xs"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-slate-400 text-center italic">
                No matching options
              </li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.id === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-primary-light text-primary font-semibold"
                        : isHighlighted
                        ? "bg-slate-100 text-heading"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate">{getDisplayLabel(opt)}</span>
                      {opt.hint && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {opt.hint}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg
                        className="w-3.5 h-3.5 text-primary ms-2 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
