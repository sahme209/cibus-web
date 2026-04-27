"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import RestaurantCard from "@/components/RestaurantCard";
import type { Restaurant, FoodItem } from "@/lib/types";
import * as api from "@/lib/api";
import Link from "next/link";

const CATEGORIES = [
  { name: "Biryani", emoji: "🍚" },
  { name: "Burgers", emoji: "🍔" },
  { name: "Pizza", emoji: "🍕" },
  { name: "Karahi", emoji: "🥘" },
  { name: "Chinese", emoji: "🥡" },
  { name: "BBQ", emoji: "🍖" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Chai", emoji: "☕" },
  { name: "Paratha", emoji: "🫓" },
  { name: "Seafood", emoji: "🦐" },
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

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => doSearch(value), 400);
    } else if (!value.trim()) {
      setSearched(false);
      setResults([]);
      setFoodResults([]);
    }
  };

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

        {loading ? (
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
        ) : searched && (results.length > 0 || foodResults.length > 0) ? (
          <div className="animate-fade-up">
            <p
              className="text-sm mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {results.length} restaurant{results.length !== 1 ? "s" : ""} found for &ldquo;{query}&rdquo;
            </p>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        ) : searched ? (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--bg-search)" }}>
              <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No results for &ldquo;{query}&rdquo;
            </h3>
            <p className="text-sm mt-1 mb-6" style={{ color: "var(--text-secondary)" }}>
              Try a different spelling or browse by category
            </p>
            <div className="flex flex-wrap justify-center gap-2">
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
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
              Browse by Cuisine
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setQuery(cat.name); doSearch(cat.name); }}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
