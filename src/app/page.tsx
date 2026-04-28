"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    if (!isLoggedIn && !authLoading) {
      setLoading(false);
      return;
    }
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
  }, [isLoggedIn, authLoading]);

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

  if (!authLoading && !isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
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
            <div className="mt-7">
              <Link
                href="/search"
                className="flex items-center gap-3 max-w-md px-5 py-3.5 rounded-full text-sm font-medium transition-all hover:shadow-xl"
                style={{ background: "white", color: "var(--text-secondary)" }}
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
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: "#00A86B" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
      </section>

      {/* Category pills */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 px-0.5 stagger-children">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?q=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-default)" }}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <PromoBanner />
      </section>

      {/* HUBB+ */}
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,215,0,0.3)", color: "#FFD700" }}>SAVE MORE</span>
              </div>
              <p className="text-sm text-white/80 max-w-md">
                Rs. 0 delivery on every order, 5% cashback, and exclusive member deals. Your first month free.
              </p>
            </div>
            <Link href="/profile" className="shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95" style={{ background: "white", color: "var(--hubb-accent)" }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8"><QuickReorder /></section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8"><PopularItems /></section>

      {/* Fastest Near You */}
      {!loading && restaurants.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Fastest Near You</h2>
            </div>
            <Link href="/search" className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-sm" style={{ color: "var(--hubb-accent)", background: "var(--hubb-tint)" }}>See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 stagger-children">
            {[...restaurants].filter(r => r.isOpen).sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)).slice(0, 6).map((r) => (
              <Link key={`fast-${r.id}`} href={`/restaurant/${r.id}`} className="shrink-0 w-44 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
                <div className="relative h-28">
                  {r.imageURL && <Image src={r.imageURL} alt={r.name} fill sizes="176px" className="object-cover" />}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white z-[1]" style={{ background: "var(--hubb-accent)" }}>{r.deliveryTime}</div>
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{r.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{r.deliveryFee === 0 ? "Free delivery" : `Rs. ${r.deliveryFee} delivery`}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Featured Restaurants</h2>
            <Link href="/search" className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-sm" style={{ color: "var(--hubb-accent)", background: "var(--hubb-tint)" }}>See All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {featured.slice(0, 6).map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </section>
      )}

      {/* New on HUBB */}
      {!loading && restaurants.length > 4 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "var(--hubb-orange)" }}>NEW</span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>New on HUBB</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {restaurants.slice(-3).map((r) => <RestaurantCard key={`new-${r.id}`} restaurant={r} />)}
          </div>
        </section>
      )}

      {/* All Restaurants */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {loading ? "Loading restaurants..." : `All Restaurants${filteredRestaurants.length !== restaurants.length ? ` (${filteredRestaurants.length})` : ""}`}
          </h2>
        </div>
        {!loading && restaurants.length > 0 && (
          <div className="mb-5"><FilterBar onSortChange={setSortBy} onFilterChange={setFilters} /></div>
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
            {filteredRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--bg-search)" }}>
              <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>No restaurants found</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Try adjusting your filters or check back later!</p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Logged-out marketing landing page ─── */

const CUISINE_CARDS = [
  { name: "Biryani", emoji: "🍚", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" },
  { name: "Burgers", emoji: "🍔", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { name: "Pizza", emoji: "🍕", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { name: "Karahi", emoji: "🥘", img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80" },
  { name: "Chinese", emoji: "🥡", img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&q=80" },
  { name: "BBQ", emoji: "🍖", img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80" },
  { name: "Desserts", emoji: "🍰", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" },
  { name: "Chai", emoji: "☕", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80" },
  { name: "Paratha", emoji: "🫓", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { name: "Seafood", emoji: "🦐", img: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80" },
];

const POPULAR_AREAS = ["F-6", "F-7", "F-8", "F-10", "F-11", "G-6", "G-8", "G-9", "G-11", "I-8", "I-9", "I-10", "Blue Area", "DHA"];

const TOP_CUISINES = ["Biryani", "Burgers", "Pizza", "Karahi", "Chinese", "BBQ", "Desserts", "Shawarma", "Nihari", "Haleem", "Paratha Rolls", "Seekh Kebab"];

const TOP_CHAINS = ["KFC", "McDonald's", "Pizza Hut", "Domino's", "Hardee's", "Subway", "Burger King", "OPTP"];

function LandingPage() {
  const [neighborhoodTab, setNeighborhoodTab] = useState<"areas" | "cuisines" | "chains">("areas");

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero — DoorDash-style with food imagery */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,80,54,0.85), rgba(0,60,40,0.78))" }} />

        {/* Floating food photos — left */}
        <div className="absolute top-8 left-6 lg:left-12 hidden lg:flex flex-col gap-4">
          <div className="relative w-44 h-44 xl:w-52 xl:h-52 rounded-3xl overflow-hidden rotate-[-5deg] shadow-2xl ring-4 ring-white/10">
            <Image src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80" alt="Biryani" fill sizes="220px" className="object-cover" />
          </div>
          <div className="relative w-36 h-36 xl:w-44 xl:h-44 rounded-3xl overflow-hidden rotate-[3deg] shadow-2xl ring-4 ring-white/10 ml-12">
            <Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" alt="Burger" fill sizes="180px" className="object-cover" />
          </div>
        </div>

        {/* Floating food photos — right */}
        <div className="absolute top-12 right-6 lg:right-12 hidden lg:flex flex-col gap-4">
          <div className="relative w-40 h-40 xl:w-48 xl:h-48 rounded-3xl overflow-hidden rotate-[5deg] shadow-2xl ring-4 ring-white/10">
            <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" alt="Pizza" fill sizes="200px" className="object-cover" />
          </div>
          <div className="relative w-36 h-36 xl:w-44 xl:h-44 rounded-3xl overflow-hidden rotate-[-4deg] shadow-2xl ring-4 ring-white/10 mr-10">
            <Image src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80" alt="Dessert" fill sizes="180px" className="object-cover" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 text-center">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight drop-shadow-lg">
              Rs. 0 delivery fee
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white/90">on your first order</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/45">Other fees apply</p>

            <div className="mt-7 flex flex-col items-center gap-3 max-w-md mx-auto">
              <Link
                href="/search"
                className="flex items-center gap-3 w-full px-5 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium transition-all hover:shadow-2xl"
                style={{ background: "white", color: "#333", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
              >
                <svg className="w-5 h-5 shrink-0" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Enter delivery address
                <span className="ml-auto w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--hubb-accent)" }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign in for saved address
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 sm:gap-12 py-6 sm:py-8 flex-wrap" style={{ borderBottom: "1px solid var(--border-default)" }}>
            {[
              { value: "500+", label: "Restaurants" },
              { value: "10K+", label: "Happy Customers" },
              { value: "30 min", label: "Avg. Delivery" },
              { value: "4.8", label: "App Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-2">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "var(--hubb-accent)" }}>{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight" style={{ color: "var(--text-primary)" }}>
            How HUBB works
          </h2>
          <p className="text-sm text-center mt-2 mb-10" style={{ color: "var(--text-secondary)" }}>Get food delivered in 3 simple steps</p>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              { step: "1", title: "Choose what you want", desc: "Browse restaurants and menus. Add items to your cart.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "#00704A" },
              { step: "2", title: "Place your order", desc: "Pay securely with cash or card. Track in real time.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "#FF3008" },
              { step: "3", title: "Get it delivered", desc: "A rider picks up your food and delivers it to your door.", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", color: "#FFB347" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: `${item.color}15` }}>
                  <svg className="w-7 h-7" style={{ color: item.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold mb-1.5 px-2.5 py-0.5 rounded-full inline-block" style={{ background: `${item.color}15`, color: item.color }}>Step {item.step}</div>
                <h3 className="text-lg font-bold mt-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm mt-1.5 max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category browsing grid — with food photos */}
      <section style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
            What are you craving?
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
            Browse by cuisine to find exactly what you want
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CUISINE_CARDS.map((cat) => (
              <Link
                key={cat.name}
                href={`/search?q=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] card-hover"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <Image src={cat.img} alt={cat.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <span className="text-2xl block mb-0.5">{cat.emoji}</span>
                  <span className="text-sm sm:text-base font-bold text-white drop-shadow-md">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HUBB+ Membership banner */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #00704A, #004D33)" }}>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "#00A86B" }} />
            <div className="absolute -bottom-16 left-1/4 w-56 h-56 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
            <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 sm:p-12">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-white">HUBB+</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,215,0,0.3)", color: "#FFD700" }}>SAVE MORE</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">Delivery for less, every single order</h3>
                <div className="flex flex-wrap gap-6 mt-5">
                  {[
                    { val: "Rs. 0", sub: "Delivery fee" },
                    { val: "5%", sub: "Cashback" },
                    { val: "30 days", sub: "Free trial" },
                  ].map((p) => (
                    <div key={p.sub}>
                      <p className="text-2xl font-extrabold text-white">{p.val}</p>
                      <p className="text-xs text-white/60">{p.sub}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "white", color: "#00704A" }}
                >
                  Try HUBB+ free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
              <div className="flex-1 max-w-sm w-full">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Premium food delivery" fill sizes="400px" className="object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,112,74,0.6), transparent)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a partner — 3 cards */}
      <section style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
            It takes two sides to make a marketplace
          </h2>
          <p className="text-sm text-center mb-10" style={{ color: "var(--text-secondary)" }}>
            Join thousands of riders, restaurants, and home cooks on HUBB
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: "Become a Rider",
                desc: "Flexible hours, daily payouts. Earn on your own schedule.",
                cta: "Start earning",
                href: "/partner/riders",
                img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80",
                stat: "Avg. Rs. 25K/month",
              },
              {
                title: "Become a Partner",
                desc: "Reach new customers and grow your restaurant revenue.",
                cta: "Sign up your restaurant",
                href: "/partner/restaurants",
                img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
                stat: "0% commission for 30 days",
              },
              {
                title: "Start a Home Kitchen",
                desc: "Cook from home and earn. Zero setup cost to get started.",
                cta: "Start cooking",
                href: "/partner/home-kitchen",
                img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
                stat: "No upfront cost",
              },
            ].map((card) => (
              <Link key={card.title} href={card.href} className="group rounded-2xl overflow-hidden card-hover" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={card.img} alt={card.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: "rgba(0,112,74,0.9)" }}>{card.stat}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{card.title}</h3>
                  <p className="text-sm mt-1.5 mb-4" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
                  <span className="text-sm font-bold inline-flex items-center gap-1.5 transition-all group-hover:gap-2.5" style={{ color: "var(--hubb-accent)" }}>
                    {card.cta}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Get more from your neighborhood */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-8" style={{ color: "var(--text-primary)" }}>
            Cities, cuisines, and more
          </h2>

          <div className="flex justify-center mb-8 gap-1 flex-wrap">
            {([
              { key: "areas" as const, label: "Popular Areas" },
              { key: "cuisines" as const, label: "Top Cuisines" },
              { key: "chains" as const, label: "Top Chains" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setNeighborhoodTab(tab.key)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: neighborhoodTab === tab.key ? "var(--hubb-accent)" : "var(--bg-search)",
                  color: neighborhoodTab === tab.key ? "white" : "var(--text-secondary)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(neighborhoodTab === "areas" ? POPULAR_AREAS : neighborhoodTab === "cuisines" ? TOP_CUISINES : TOP_CHAINS).map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="text-sm font-medium py-2.5 px-4 rounded-xl text-center transition-all hover:-translate-y-0.5"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Get the app CTA */}
      <section id="get-app" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col sm:flex-row items-center gap-10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00704A, #005C3C, #004D33)" }}
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "#00A86B" }} />
          <div className="relative flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white/90 mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Coming Soon
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">Get the HUBB app</h3>
            <p className="text-sm sm:text-base text-white/70 mb-6 max-w-md">Order faster. Get exclusive deals, real-time tracking, and personalized recommendations.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-60 leading-none">Download on the</div>
                  <div className="text-sm font-bold leading-tight">App Store</div>
                </div>
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.38l2.458 1.42c.63.364.63 1.14 0 1.506l-2.14 1.237-2.535-2.535 2.217-1.628zM5.864 2.658L16.8 8.991l-2.302 2.302-8.635-8.635z" /></svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-60 leading-none">GET IT ON</div>
                  <div className="text-sm font-bold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          {/* Phone mockup */}
          <div className="shrink-0 relative">
            <div className="w-48 h-80 sm:w-52 sm:h-[360px] rounded-[2rem] border-4 border-white/20 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(180deg, #005C3C, #003D29)" }}>
              <div className="absolute top-3 w-20 h-5 rounded-full" style={{ background: "rgba(0,0,0,0.3)" }} />
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
                <span className="text-2xl font-black text-white">H</span>
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">HUBB</span>
              <span className="text-[10px] text-white/50 mt-1">Food delivery</span>
              <div className="mt-5 w-3/4 space-y-2">
                <div className="h-8 rounded-xl bg-white/10 w-full" />
                <div className="flex gap-2">
                  <div className="h-16 rounded-xl bg-white/8 flex-1" />
                  <div className="h-16 rounded-xl bg-white/8 flex-1" />
                </div>
                <div className="h-2 rounded-full bg-white/10 w-4/5" />
                <div className="h-2 rounded-full bg-white/8 w-3/5" />
              </div>
              <div className="absolute bottom-4 w-1/3 h-1 rounded-full bg-white/30" />
            </div>
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-20 blur-2xl -z-10" style={{ background: "#00A86B" }} />
          </div>
        </div>
      </section>
    </div>
  );
}
