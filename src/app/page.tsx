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

const PARTNER_CARDS = [
  {
    icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    title: "Become a Rider",
    desc: "As a delivery rider, make money and work on your own schedule. Sign up in minutes.",
    cta: "Start earning",
    href: "/partner/riders",
  },
  {
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    title: "Become a Partner",
    desc: "Attract new customers and grow your sales. 0% commissions for your first 30 days.",
    cta: "Sign up for HUBB",
    href: "/partner/restaurants",
  },
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    title: "Start a Home Kitchen",
    desc: "Cook from home and earn. Zero setup cost, flexible hours, customers at your doorstep.",
    cta: "Start cooking",
    href: "/partner/home-kitchen",
  },
  {
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "Get the best HUBB experience",
    desc: "Experience the best your neighborhood has to offer, all in one app.",
    cta: "Get the app",
    href: "#get-app",
  },
];

const VALUE_SECTIONS = [
  {
    title: "Everything you crave, delivered.",
    subtitle: "Your favorite local restaurants",
    desc: "Get biryani from the place you love, or try the new burger joint everyone's talking about — delivered straight to your door.",
    cta: "Find restaurants",
    href: "/search",
    bg: "var(--bg-primary)",
  },
  {
    title: "HUBB+ is delivery for less",
    subtitle: "Members save on every order",
    desc: "Members get Rs. 0 delivery fee on HUBB+ orders, 5% cashback on pickup orders, and so much more. Plus, it's free for 30 days.",
    cta: "Get HUBB+",
    href: "/auth",
    bg: "var(--bg-secondary)",
  },
];

const TOP_CITIES = ["Islamabad", "Lahore", "Karachi", "Rawalpindi", "Faisalabad", "Peshawar", "Multan", "Quetta"];

const TOP_CUISINES = ["Biryani", "Burgers", "Pizza", "Karahi", "Chinese", "BBQ", "Desserts", "Shawarma", "Nihari", "Haleem", "Paratha Rolls", "Seekh Kebab"];

const TOP_CHAINS = ["KFC", "McDonald's", "Pizza Hut", "Domino's", "Hardee's", "Subway", "Burger King", "OPTP"];

function LandingPage() {
  const [neighborhoodTab, setNeighborhoodTab] = useState<"cities" | "cuisines" | "chains">("cities");

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "rgba(255,255,255,0.2)" }}>H</div>
              <span className="text-xl font-bold text-white">HUBB</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Rs. 0 delivery fee
              <br />
              on your first order
            </h1>
            <p className="mt-3 text-sm text-white/50">Other fees apply. Available at participating stores.</p>

            <div className="mt-8 flex flex-col items-center gap-3 max-w-md mx-auto">
              <Link
                href="/search"
                className="flex items-center gap-3 w-full px-5 py-4 rounded-full text-sm font-medium transition-all hover:shadow-xl"
                style={{ background: "white", color: "var(--text-secondary)" }}
              >
                <svg className="w-5 h-5 shrink-0" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Enter delivery address
                <span
                  className="ml-auto w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign in for saved address
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: "#00A86B" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
      </section>

      {/* 3 Partner CTA cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid sm:grid-cols-3 gap-5">
          {PARTNER_CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl p-6 text-center transition-all hover:-translate-y-1"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}
            >
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                <svg className="w-7 h-7" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--text-primary)" }}>{card.title}</h3>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
              <span className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "var(--hubb-accent)" }}>
                {card.cta}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Value prop sections — alternating layout */}
      {VALUE_SECTIONS.map((section, i) => (
        <section key={section.title} style={{ background: section.bg }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10`}>
              <div className="flex-1 max-w-lg">
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {section.title}
                </h2>
                <p className="text-sm font-semibold mt-3" style={{ color: "var(--text-primary)" }}>{section.subtitle}</p>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.desc}</p>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {section.cta}
                </Link>
              </div>
              <div className="flex-1 max-w-lg w-full">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={i === 0
                      ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                      : "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
                    }
                    alt={i === 0 ? "Delicious food spread" : "HUBB+ premium delivery"}
                    fill
                    sizes="(max-width: 768px) 100vw, 512px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: i === 0 ? "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" : "linear-gradient(to top, rgba(0,112,74,0.8), rgba(0,112,74,0.3))" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {i === 0 ? (
                      <p className="text-lg font-bold text-white">500+ restaurants near you</p>
                    ) : (
                      <div className="text-white">
                        <span className="text-2xl font-black">HUBB+</span>
                        <div className="flex gap-4 mt-2 text-sm text-white/90">
                          <span>Rs. 0 delivery</span>
                          <span>5% cashback</span>
                          <span>Member deals</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Category browsing grid */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: "var(--text-primary)" }}>
            What are you craving?
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
            Browse by cuisine to find exactly what you want
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/search?q=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunity section — Riders + Businesses */}
      <section style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
            Unlocking opportunity for riders and businesses
          </h2>

          {/* Rider CTA */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1 aspect-[4/3] max-w-lg w-full rounded-2xl overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80"
                alt="Delivery rider on motorcycle"
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xl font-bold text-white">Earn on your schedule</p>
                <p className="text-sm text-white/70 mt-1">Flexible hours, daily payouts</p>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Sign up to ride and get paid</h3>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Deliver with the #1 Food and Delivery App in Pakistan. As a delivery rider, you&apos;ll make money and work on your own schedule. Sign up in minutes.
              </p>
              <Link
                href="/partner/riders"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Become a Rider
              </Link>
            </div>
          </div>

          {/* Business CTA */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="flex-1 aspect-[4/3] max-w-lg w-full rounded-2xl overflow-hidden relative">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                alt="Restaurant interior"
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xl font-bold text-white">Grow your revenue</p>
                <p className="text-sm text-white/70 mt-1">Reach thousands of new customers</p>
              </div>
            </div>
            <div className="flex-1 max-w-lg">
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Grow your business with HUBB</h3>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Businesses large and small partner with HUBB to reach new customers, increase order volume, and drive more sales.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  href="/partner/restaurants"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  Become a Partner
                </Link>
                <Link
                  href="/partner/home-kitchen"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: "var(--bg-search)", color: "var(--hubb-accent)", border: "1.5px solid var(--hubb-accent)" }}
                >
                  Start a Home Kitchen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get more from your neighborhood */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
            Get more from your neighborhood
          </h2>

          {/* Tabs */}
          <div className="flex justify-center mb-8" style={{ borderBottom: "1px solid var(--border-default)" }}>
            {([
              { key: "cities" as const, label: "Top Cities" },
              { key: "cuisines" as const, label: "Top Cuisines" },
              { key: "chains" as const, label: "Top Chains" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setNeighborhoodTab(tab.key)}
                className="px-6 py-3 text-sm font-semibold transition-colors relative"
                style={{
                  color: neighborhoodTab === tab.key ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              >
                {tab.label}
                {neighborhoodTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "var(--text-primary)" }} />
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3">
            {(neighborhoodTab === "cities" ? TOP_CITIES : neighborhoodTab === "cuisines" ? TOP_CUISINES : TOP_CHAINS).map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="text-sm py-1 transition-colors hover:underline"
                style={{ color: "var(--text-secondary)" }}
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
          className="rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--hubb-primary), #2D2D30)" }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
          <div className="relative flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Get the HUBB app</h3>
            <p className="text-sm text-white/60 mb-6">Order faster with the app. Get exclusive deals and real-time tracking on every order.</p>
            <div className="flex gap-3">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 relative" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                App Store
                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-white/20">SOON</span>
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 relative" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.38l2.458 1.42c.63.364.63 1.14 0 1.506l-2.14 1.237-2.535-2.535 2.217-1.628zM5.864 2.658L16.8 8.991l-2.302 2.302-8.635-8.635z" /></svg>
                Google Play
                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-white/20">SOON</span>
              </a>
            </div>
          </div>
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "var(--hubb-accent)" }}>
            <span className="text-4xl font-black text-white">H</span>
          </div>
        </div>
      </section>
    </div>
  );
}
