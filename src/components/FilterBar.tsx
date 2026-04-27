"use client";

import { useState } from "react";

interface FilterBarProps {
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: Record<string, boolean>) => void;
}

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Top Rated" },
  { value: "delivery_time", label: "Fastest Delivery" },
  { value: "delivery_fee", label: "Lowest Fee" },
  { value: "distance", label: "Nearest" },
];

const FILTER_CHIPS = [
  { key: "freeDelivery", label: "Free Delivery", icon: "🚲" },
  { key: "deals", label: "Deals", icon: "🏷️" },
  { key: "rating4plus", label: "4.0+", icon: "⭐" },
  { key: "under30min", label: "Under 30 min", icon: "⚡" },
  { key: "open", label: "Open Now", icon: "🟢" },
];

export default function FilterBar({ onSortChange, onFilterChange }: FilterBarProps) {
  const [activeSort, setActiveSort] = useState("recommended");
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [showSort, setShowSort] = useState(false);

  function toggleFilter(key: string) {
    const updated = { ...activeFilters, [key]: !activeFilters[key] };
    setActiveFilters(updated);
    onFilterChange?.(updated);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2">
      {/* Sort dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowSort(!showSort)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          {SORT_OPTIONS.find((s) => s.value === activeSort)?.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showSort && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
            <div
              className="absolute left-0 top-11 w-48 rounded-xl py-1 z-50"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-default)",
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setActiveSort(opt.value);
                    setShowSort(false);
                    onSortChange?.(opt.value);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                  style={{
                    color:
                      activeSort === opt.value
                        ? "var(--hubb-accent)"
                        : "var(--text-primary)",
                    fontWeight: activeSort === opt.value ? 600 : 400,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div
        className="w-px h-6 shrink-0"
        style={{ background: "var(--border-default)" }}
      />

      {/* Filter chips */}
      {FILTER_CHIPS.map((chip) => {
        const active = activeFilters[chip.key];
        return (
          <button
            key={chip.key}
            onClick={() => toggleFilter(chip.key)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium shrink-0 transition-all"
            style={{
              background: active
                ? "var(--hubb-accent)"
                : "var(--bg-card)",
              color: active ? "white" : "var(--text-primary)",
              border: active
                ? "1px solid transparent"
                : "1px solid var(--border-default)",
            }}
          >
            <span className="text-xs">{chip.icon}</span>
            {chip.label}
          </button>
        );
      })}

      {/* Clear all filters */}
      {Object.values(activeFilters).some(Boolean) && (
        <button
          onClick={() => {
            setActiveFilters({});
            onFilterChange?.({});
          }}
          className="shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all"
          style={{ color: "var(--hubb-orange)" }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
