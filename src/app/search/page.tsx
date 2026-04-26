"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RestaurantCard from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/types";
import * as api from "@/lib/api";

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
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  async function doSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.searchRestaurants(q);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Search bar */}
      <div style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="mx-auto max-w-3xl px-4 py-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(query);
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
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
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, dishes..."
                className="w-full pl-12 pr-4 py-3 rounded-full text-sm"
                style={{
                  background: "var(--bg-search)",
                  color: "var(--text-primary)",
                  border: "none",
                }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ background: "var(--hubb-accent)" }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="aspect-[16/10]" style={{ background: "var(--bg-search)" }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 rounded-full w-3/4" style={{ background: "var(--bg-search)" }} />
                  <div className="h-3 rounded-full w-1/2" style={{ background: "var(--bg-search)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p
              className="text-sm mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No results found
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              What are you craving?
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Search for restaurants, cuisines, or dishes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
