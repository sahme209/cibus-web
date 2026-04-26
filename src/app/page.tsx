"use client";

import { useEffect, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
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

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--cibus-primary)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Your favorite food,
              <br />
              <span style={{ color: "var(--cibus-accent)" }}>delivered fast.</span>
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Order from the best restaurants in your city. Exclusive deals, real-time tracking, and premium quality every time.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors"
                style={{ background: "var(--cibus-accent)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Restaurants
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--cibus-accent)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--cibus-accent)" }}
        />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div
          className="flex gap-3 overflow-x-auto hide-scrollbar py-4 px-2"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?q=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-2 shrink-0 px-5 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
                minWidth: 90,
              }}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
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
              className="text-sm font-semibold"
              style={{ color: "var(--cibus-accent)" }}
            >
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 6).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <h2
          className="text-xl font-bold mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          {loading ? "Loading restaurants..." : "All Restaurants"}
        </h2>
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
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              No restaurants found
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              We&apos;re expanding soon. Check back later!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
