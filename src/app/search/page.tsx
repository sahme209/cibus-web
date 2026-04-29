"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import RestaurantCard from "@/components/RestaurantCard";
import type { Restaurant, FoodItem } from "@/lib/types";
import * as api from "@/lib/api";
import Link from "next/link";

const CATEGORIES = [
  { name: "Biryani", emoji: "🍚", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80" },
  { name: "Burgers", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
  { name: "Pizza", emoji: "🍕", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" },
  { name: "Karahi", emoji: "🥘", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80" },
  { name: "Chinese", emoji: "🥡", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&q=80" },
  { name: "BBQ", emoji: "🍖", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80" },
  { name: "Desserts", emoji: "🍰", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80" },
  { name: "Chai", emoji: "☕", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80" },
  { name: "Paratha", emoji: "🫓", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80" },
  { name: "Seafood", emoji: "🦐", img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=300&q=80" },
];

const TRENDING = [
  "Chicken Biryani",
  "Cheese Burger",
  "Pepperoni Pizza",
  "Butter Chicken Karahi",
  "Chocolate Cake",
  "Chicken Shawarma",
];

const RECENT_KEY = "hubb_recent_searches";
const MAX_RECENT = 8;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  const trimmed = q.trim();
  if (!trimmed) return;
  const recent = getRecentSearches().filter((s) => s !== trimmed);
  recent.unshift(trimmed);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--bg-secondary)" }} />}>
      <SearchContent />
    </Suspense>
  );
}

type FilterKey = "freeDelivery" | "rating4plus" | "under30min";

const FILTER_CHIPS: { key: FilterKey; label: string }[] = [
  { key: "freeDelivery", label: "Free Delivery" },
  { key: "rating4plus", label: "Rating 4+" },
  { key: "under30min", label: "Under 30 min" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, boolean>>({ freeDelivery: false, rating4plus: false, under30min: false });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const suggestRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    saveRecentSearch(q);
    setRecentSearches(getRecentSearches());
    try {
      const [restaurants, foods] = await Promise.allSettled([
        api.searchRestaurants(q),
        api.searchFoodItems(q),
      ]);
      if (restaurants.status === "fulfilled") setResults(restaurants.value);
      if (foods.status === "fulfilled") {
        const list = Array.isArray(foods.value) ? foods.value : [];
        setFoodResults(list.slice(0, 6));
      }
    } catch {
      setResults([]);
      setFoodResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (suggestRef.current) clearTimeout(suggestRef.current);
    if (value.trim().length >= 2) {
      setDebouncing(true);
      debounceRef.current = setTimeout(() => { setDebouncing(false); doSearch(value); setSuggestions([]); }, 400);
      suggestRef.current = setTimeout(() => {
        const q = value.toLowerCase();
        const matches = [
          ...CATEGORIES.map((c) => c.name),
          ...TRENDING,
        ].filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q);
        setSuggestions(matches.slice(0, 5));
      }, 100);
    } else {
      setDebouncing(false);
      setSuggestions([]);
      if (!value.trim()) {
        setSearched(false);
        setResults([]);
        setFoodResults([]);
      }
    }
  };

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredResults = results.filter((r) => {
    if (activeFilters.freeDelivery && r.deliveryFee !== 0) return false;
    if (activeFilters.rating4plus && r.rating < 4.0) return false;
    if (activeFilters.under30min) {
      const mins = parseInt(r.deliveryTime);
      if (isNaN(mins) || mins > 30) return false;
    }
    return true;
  });

  const showSuggestions = inputFocused && !searched && query.length === 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Search bar */}
      <div
        className="sticky top-16 z-30"
        style={{
          background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(query);
              inputRef.current?.blur();
            }}
            className="relative"
          >
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-tertiary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setTimeout(() => setInputFocused(false), 200)}
              placeholder="Search restaurants, cuisines, dishes..."
              className="w-full pl-12 pr-20 py-3.5 rounded-2xl text-sm transition-shadow focus:shadow-md"
              style={{
                background: "var(--bg-search)",
                color: "var(--text-primary)",
                border: "none",
              }}
              aria-label="Search restaurants and dishes"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearched(false);
                  setResults([]);
                  setFoodResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-16 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--bg-surface)", color: "var(--text-tertiary)" }}
                aria-label="Clear search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "var(--hubb-accent)" }}
            >
              Search
            </button>
          </form>
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && inputFocused && !loading && (
            <div
              className="absolute left-4 right-4 top-full mt-1 rounded-xl py-1 z-50 animate-fade-in overflow-hidden"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-default)" }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => { e.preventDefault(); setQuery(s); doSearch(s); setSuggestions([]); inputRef.current?.blur(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--text-primary)" }}
                >
                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span dangerouslySetInnerHTML={{
                    __html: s.replace(
                      new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                      '<strong>$1</strong>'
                    ),
                  }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Suggestions dropdown when focused and no search */}
        {showSuggestions && (recentSearches.length > 0 || TRENDING.length > 0) && (
          <div className="mb-6 animate-fade-up">
            {recentSearches.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Recent Searches
                  </h3>
                  <button
                    onClick={() => {
                      clearRecentSearches();
                      setRecentSearches([]);
                    }}
                    className="text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--hubb-accent)" }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); doSearch(s); }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", color: "var(--text-primary)" }}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                Trending Now
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => { setQuery(t); doSearch(t); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", color: "var(--text-primary)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: "var(--hubb-accent)" }}>
                      {i + 1}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Debounce searching indicator */}
        {debouncing && !loading && (
          <div className="flex items-center justify-center gap-2 py-4 mb-4 animate-fade-up">
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border-default)", borderTopColor: "var(--hubb-accent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Searching...</span>
          </div>
        )}

        {loading ? (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border-default)", borderTopColor: "var(--hubb-accent)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Searching for &ldquo;{query}&rdquo;...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-[16/10] skeleton-shimmer" />
                  <div className="p-4 space-y-3" style={{ background: "var(--bg-card)" }}>
                    <div className="h-4 rounded-full w-3/4 skeleton-shimmer" />
                    <div className="h-3 rounded-full w-1/2 skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searched && (results.length > 0 || foodResults.length > 0) ? (
          <div className="animate-fade-up">
            <p
              className="text-sm mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {results.length} restaurant{results.length !== 1 ? "s" : ""} found for &ldquo;{query}&rdquo;
            </p>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => toggleFilter(chip.key)}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: activeFilters[chip.key] ? "var(--hubb-accent)" : "var(--bg-card)",
                    color: activeFilters[chip.key] ? "white" : "var(--text-primary)",
                    boxShadow: "var(--shadow-sm)",
                    border: activeFilters[chip.key] ? "1.5px solid var(--hubb-accent)" : "1.5px solid var(--border-default)",
                  }}
                >
                  {chip.label}
                </button>
              ))}
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={() => setActiveFilters({ freeDelivery: false, rating4plus: false, under30min: false })}
                  className="px-3 py-2 rounded-full text-xs font-medium transition-all hover:opacity-70"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Food item matches */}
            {foodResults.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                  Matching Dishes
                </h3>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {foodResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/restaurant/${item.restaurantID}`}
                      className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", minWidth: 200 }}
                    >
                      {item.imageURL ? (
                        <Image src={item.imageURL} alt={item.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "var(--bg-search)" }}>
                          <span>🍽️</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{item.restaurantName}</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: "var(--hubb-accent)" }}>Rs. {Math.round(item.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant results */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {filteredResults.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No restaurants match the selected filters. Try removing some filters.
                </p>
              </div>
            )}
          </div>
        ) : searched ? (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-5" style={{ background: "var(--bg-search)" }}>
              <svg className="w-12 h-12" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No results for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-sm mt-2 mb-2 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
              We couldn&apos;t find any restaurants or dishes matching your search. Try a different spelling or browse by category below.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setQuery(cat.name); doSearch(cat.name); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", color: "var(--text-primary)" }}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        ) : !showSuggestions ? (
          /* Browse state — show categories to explore */
          <div className="animate-fade-up">
            <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Browse by Cuisine
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setQuery(cat.name); doSearch(cat.name); }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] text-left transition-all hover:-translate-y-1"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <Image src={cat.img} alt={cat.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-xl block mb-0.5">{cat.emoji}</span>
                    <span className="text-sm font-bold text-white drop-shadow-md">{cat.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
