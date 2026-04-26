"use client";

import { useEffect, useMemo, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import PromoBanner from "@/components/PromoBanner";
import PopularItems from "@/components/PopularItems";
import QuickReorder from "@/components/QuickReorder";
import FilterBar from "@/components/FilterBar";
import type { Restaurant } from "@/lib/types";
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

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featured, setFeatured] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const [all, feat] = await Promise.allSettled([
          api.getRestaurants(33.6844, 73.0479, 15),
          api.getFeaturedRestaurants(),
        ]);
        if (all.status === "fulfilled") setRestaurants(all.value);
        if (feat.status === "fulfilled") setFeatured(feat.value);
      } catch {
        // fallback handled by empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let list = [...restaurants];
    if (filters.freeDelivery) list = list.filter((r) => r.deliveryFee === 0);
    if (filters.rating4plus) list = list.filter((r) => r.rating >= 4.0);
    if (filters.under30min) list = list.filter((r) => {
      const mins = parseInt(r.deliveryTime);
      return !isNaN(mins) && mins <= 30;
    });
    if (filters.open) list = list.filter((r) => r.isOpen);

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "delivery_time":
        list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case "delivery_fee":
        list.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case "distance":
        list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
    }
    return list;
  }, [restaurants, sortBy, filters]);

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hubb-primary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Your favorite food,
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>delivered fast.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-lg">
              Order from the best restaurants in your city. Exclusive deals, real-time tracking, and premium quality.
            </p>

            {/* Search bar in hero */}
            <div className="mt-7">
              <Link
                href="/search"
                className="flex items-center gap-3 w-full max-w-md px-5 py-3.5 rounded-full text-sm transition-all hover:shadow-xl"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search for restaurants or dishes...
              </Link>
            </div>

            {/* Live stats bar — only show once data is loaded */}
            {!loading && restaurants.length > 0 && (
              <div className="flex items-center gap-6 mt-8">
                <div>
                  <p className="text-2xl font-bold text-white">{restaurants.length}</p>
                  <p className="text-xs text-white/40">Restaurants</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(restaurants.reduce((sum, r) => sum + parseInt(r.deliveryTime) || 0, 0) / restaurants.length)} min
                  </p>
                  <p className="text-xs text-white/40">Avg. Delivery</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <p className="text-2xl font-bold" style={{ color: "var(--hubb-accent)" }}>
                    {(restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)}★
                  </p>
                  <p className="text-xs text-white/40">Avg. Rating</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-8 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-5 blur-3xl animate-float" style={{ background: "var(--hubb-gold)" }} />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-3 px-1 stagger-children">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?q=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-1.5 shrink-0 px-4 py-3 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-md"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                minWidth: 80,
              }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <PromoBanner />
      </section>

      {/* Quick Reorder */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <QuickReorder />
      </section>

      {/* Popular Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <PopularItems />
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Featured Restaurants
            </h2>
            <Link
              href="/search"
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--hubb-accent)" }}
            >
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {featured.slice(0, 6).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {loading ? "Loading restaurants..." : `All Restaurants${filteredRestaurants.length !== restaurants.length ? ` (${filteredRestaurants.length})` : ""}`}
          </h2>
        </div>
        {!loading && restaurants.length > 0 && (
          <div className="mb-5">
            <FilterBar
              onSortChange={setSortBy}
              onFilterChange={setFilters}
            />
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
              >
                <div className="aspect-[16/10] skeleton-shimmer" />
                <div className="p-4 space-y-3" style={{ background: "var(--bg-card)" }}>
                  <div className="h-4 rounded-full w-3/4 skeleton-shimmer" />
                  <div className="h-3 rounded-full w-1/2 skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-up">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: "var(--bg-search)" }}
            >
              <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No restaurants found
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Try adjusting your filters or check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
