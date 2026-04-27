"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RestaurantCard from "@/components/RestaurantCard";
import PromoBanner from "@/components/PromoBanner";
import PopularItems from "@/components/PopularItems";
import QuickReorder from "@/components/QuickReorder";
import FilterBar from "@/components/FilterBar";
import { useAuth } from "@/lib/store";
import type { Restaurant } from "@/lib/types";
import * as api from "@/lib/api";

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
  const { isLoggedIn, user, loading: authLoading } = useAuth();
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
      {/* Hero — Starbucks-green DoorDash-inspired */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hubb-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl animate-fade-up">
            {isLoggedIn && user?.name ? (
              <p className="text-base font-medium text-white/70 mb-2">
                Welcome back, {user.name.split(" ")[0]}
              </p>
            ) : null}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Rs. 0 delivery fee
              <br />
              on your first order
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/60">
              Other fees apply. Available at participating stores.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/search"
                className="flex items-center gap-3 flex-1 max-w-md px-5 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-xl"
                style={{
                  background: "white",
                  color: "var(--text-secondary)",
                }}
              >
                <svg className="w-5 h-5 shrink-0" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Enter delivery address
                <svg className="w-5 h-5 ml-auto shrink-0" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              {!authLoading && !isLoggedIn && (
                <Link
                  href="/auth"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign in for saved address
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: "#00A86B" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
      </section>

      {/* Category pills — DoorDash-style horizontal scroll */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-0.5 stagger-children">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?q=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--border-default)",
              }}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: "var(--text-primary)" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <PromoBanner />
      </section>

      {/* HUBB+ Membership Teaser */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div
          className="rounded-2xl p-5 sm:p-6 relative overflow-hidden animate-fade-up"
          style={{ background: "linear-gradient(135deg, var(--hubb-accent), #005C3C)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: "#FFD700" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg font-black text-white">HUBB+</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,215,0,0.3)", color: "#FFD700" }}>
                  SAVE MORE
                </span>
              </div>
              <p className="text-sm text-white/80 max-w-md">
                Rs. 0 delivery on every order, 5% cashback, and exclusive member deals. Your first month free.
              </p>
            </div>
            <Link
              href="/profile"
              className="shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: "white", color: "var(--hubb-accent)" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Reorder */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <QuickReorder />
      </section>

      {/* Popular Items */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <PopularItems />
      </section>

      {/* Fastest Near You */}
      {!loading && restaurants.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Fastest Near You
              </h2>
            </div>
            <Link
              href="/search"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-sm"
              style={{ color: "var(--hubb-accent)", background: "var(--hubb-tint)" }}
            >
              See All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 stagger-children">
            {[...restaurants]
              .filter(r => r.isOpen)
              .sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime))
              .slice(0, 6)
              .map((r) => (
                <Link
                  key={`fast-${r.id}`}
                  href={`/restaurant/${r.id}`}
                  className="shrink-0 w-44 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="relative h-28">
                    {r.imageURL && (
                      <img src={r.imageURL} alt={r.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "var(--hubb-accent)" }}>
                      {r.deliveryTime}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      {r.deliveryFee === 0 ? "Free delivery" : `Rs. ${r.deliveryFee} delivery`}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Featured / Weekly Deals */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Featured Restaurants
            </h2>
            <Link
              href="/search"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-sm"
              style={{
                color: "var(--hubb-accent)",
                background: "var(--hubb-tint)",
              }}
            >
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {featured.slice(0, 6).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {/* New on HUBB */}
      {!loading && restaurants.length > 4 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "var(--hubb-orange)" }}>NEW</span>
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              New on HUBB
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {restaurants.slice(-3).map((r) => (
              <RestaurantCard key={`new-${r.id}`} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <div className="flex items-center justify-between mb-2">
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
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
              <div key={i} className="rounded-2xl overflow-hidden">
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
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
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
