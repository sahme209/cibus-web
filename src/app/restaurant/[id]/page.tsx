"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import FoodItemCard from "@/components/FoodItemCard";
import RestaurantCard from "@/components/RestaurantCard";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import * as api from "@/lib/api";
import Link from "next/link";
import { saveRecentlyViewed } from "@/components/RecentlyViewed";
import type { Restaurant, FoodCategory, FoodItem, CustomizationOption } from "@/lib/types";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<CustomizationOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [similarRestaurants, setSimilarRestaurants] = useState<Restaurant[]>([]);
  const { cart, subtotal, itemCount, addItem } = useCart();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const closeCustomization = useCallback(() => setCustomizingItem(null), []);

  useEffect(() => {
    if (!customizingItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCustomization();
    };
    document.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [customizingItem, closeCustomization]);

  const filteredMenu = useMemo(() => {
    if (!menuSearch.trim()) return menu;
    const q = menuSearch.toLowerCase();
    return menu
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menu, menuSearch]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [detail, menuData] = await Promise.all([
          api.getRestaurantDetail(id),
          api.getRestaurantMenu(id),
        ]);
        setRestaurant(detail);
        saveRecentlyViewed({
          id: detail.id,
          name: detail.name,
          imageURL: detail.imageURL,
          cuisine: detail.cuisine,
          rating: detail.rating,
          deliveryTime: detail.deliveryTime,
        });
        const categories = menuData.categories || menuData.menu || menuData || [];
        setMenu(categories);
        if (categories.length > 0) setActiveSection(categories[0].id);
        try {
          const all = await api.getRestaurants(33.6844, 73.0479, 15);
          const similar = all
            .filter((r: Restaurant) => r.id !== id && r.cuisine === detail.cuisine)
            .slice(0, 4);
          if (similar.length < 4) {
            const others = all.filter((r: Restaurant) => r.id !== id && !similar.some((s: Restaurant) => s.id === r.id)).slice(0, 4 - similar.length);
            similar.push(...others);
          }
          setSimilarRestaurants(similar);
        } catch {
          // non-critical
        }
      } catch {
        // error handled by null state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
        <div>
          <div className="h-64 sm:h-80 skeleton-shimmer" />
          <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
            <div className="h-8 w-64 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-48 rounded-lg skeleton-shimmer" />
            <div className="flex gap-3 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-24 rounded-full skeleton-shimmer" />
              ))}
            </div>
            <div className="space-y-3 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl skeleton-shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--bg-search)" }}>
            <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Restaurant not found
          </h2>
          <Link href="/" className="inline-block mt-4 px-5 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: "var(--hubb-accent)" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
        <Image
          src={restaurant.imageURL}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        <Link
          href="/"
          aria-label="Go back to home"
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Share & Save buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: restaurant.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                showToast("Link copied!");
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
            style={{ background: "rgba(0,0,0,0.3)" }}
            aria-label="Share restaurant"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
            style={{ background: "rgba(0,0,0,0.3)" }}
            aria-label="Save restaurant"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-up">
            {!restaurant.isOpen && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2" style={{ background: "var(--hubb-orange)" }}>
                Currently Closed
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <span style={{ color: "var(--hubb-gold)" }}>★</span>
                {restaurant.rating.toFixed(1)}
                <span className="text-white/50">({restaurant.reviewCount})</span>
              </span>
              <span className="text-white/30">•</span>
              <span>{restaurant.cuisine}</span>
              <span className="text-white/30">•</span>
              <span>{restaurant.deliveryTime}</span>
              <span className="text-white/30">•</span>
              <span>{restaurant.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div
        className="border-b"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 py-3 overflow-x-auto hide-scrollbar text-sm">
            <div className="flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: "var(--text-primary)" }}>{restaurant.deliveryTime}</span>
            </div>
            <div className="w-px h-5 shrink-0" style={{ background: "var(--border-default)" }} />
            <div className="flex items-center gap-1.5 shrink-0">
              <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span style={{ color: "var(--text-primary)" }}>{restaurant.distance}</span>
            </div>
            <div className="w-px h-5 shrink-0" style={{ background: "var(--border-default)" }} />
            <span
              className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: restaurant.deliveryFee === 0 ? "var(--hubb-tint)" : "var(--bg-search)",
                color: restaurant.deliveryFee === 0 ? "var(--hubb-green)" : "var(--text-primary)",
              }}
            >
              {restaurant.deliveryFee === 0 ? "Free Delivery" : `Rs. ${restaurant.deliveryFee} delivery`}
            </span>
            {restaurant.minimumOrder > 0 && (
              <>
                <div className="w-px h-5 shrink-0" style={{ background: "var(--border-default)" }} />
                <span className="shrink-0 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Min. Rs. {restaurant.minimumOrder}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      {restaurant.description && (
        <div
          className="border-b"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {restaurant.description}
            </p>
          </div>
        </div>
      )}

      {/* Store Info */}
      <div
        className="border-b"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowStoreInfo(!showStoreInfo)}
            className="w-full flex items-center justify-between py-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More info
            </span>
            <svg
              className="w-4 h-4 transition-transform"
              style={{ color: "var(--text-tertiary)", transform: showStoreInfo ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showStoreInfo && (
            <div className="pb-4 space-y-3 animate-fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl p-3.5" style={{ background: "var(--bg-search)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Delivery Time</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{restaurant.deliveryTime}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Estimated for your location</p>
                </div>
                <div className="rounded-xl p-3.5" style={{ background: "var(--bg-search)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Rating</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{restaurant.rating.toFixed(1)} <span className="font-normal text-xs" style={{ color: "var(--text-tertiary)" }}>({restaurant.reviewCount} reviews)</span></p>
                </div>
                <div className="rounded-xl p-3.5" style={{ background: "var(--bg-search)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Pricing</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {restaurant.deliveryFee === 0 ? "Free Delivery" : `Rs. ${restaurant.deliveryFee} delivery`}
                  </p>
                  {restaurant.minimumOrder > 0 && (
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Min. order Rs. {restaurant.minimumOrder}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisine && restaurant.cuisine.split(",").map((c: string) => (
                  <span
                    key={c.trim()}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "var(--bg-search)", color: "var(--text-secondary)" }}
                  >
                    {c.trim()}
                  </span>
                ))}
                {restaurant.tags && (restaurant.tags as string[]).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "var(--hubb-tint)", color: "var(--hubb-green)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-8">
          {/* Menu */}
          <div className="flex-1 min-w-0">
            {/* Most Popular Section */}
            {(() => {
              const popularItems = menu.flatMap(cat => cat.items).filter(item => item.isPopular);
              if (popularItems.length === 0) return null;
              return (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🔥</span>
                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      Most Popular
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {popularItems.slice(0, 4).map((item) => (
                      <FoodItemCard
                        key={`popular-${item.id}`}
                        item={item}
                        onCustomize={(it) => {
                          setCustomizingItem(it);
                          setSelectedOptions([]);
                          setQuantity(1);
                          setSpecialInstructions("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Menu search */}
            {menu.length > 0 && (
              <div className="relative mb-3">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-tertiary)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search this menu..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  style={{
                    background: "var(--bg-search)",
                    color: "var(--text-primary)",
                    border: "none",
                  }}
                />
                {menuSearch && (
                  <button
                    onClick={() => setMenuSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "var(--bg-surface)", color: "var(--text-tertiary)" }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Category tabs */}
            {filteredMenu.length > 0 && !menuSearch && (
              <div
                className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 sticky top-16 z-10 pt-3 -mx-4 px-4"
                style={{
                  background: "color-mix(in srgb, var(--bg-secondary) 90%, transparent)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {menu.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveSection(cat.id);
                      document
                        .getElementById(`section-${cat.id}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background:
                        activeSection === cat.id
                          ? "var(--text-primary)"
                          : "var(--bg-card)",
                      color:
                        activeSection === cat.id
                          ? "var(--bg-primary)"
                          : "var(--text-secondary)",
                      boxShadow: activeSection === cat.id ? "var(--shadow-sm)" : "none",
                    }}
                  >
                    {cat.name} ({cat.items.length})
                  </button>
                ))}
              </div>
            )}

            {/* Sections */}
            <div className="space-y-6 mt-3">
              {filteredMenu.map((cat) => (
                <div key={cat.id} id={`section-${cat.id}`}>
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cat.name}
                  </h2>
                  <div className="space-y-4">
                    {cat.items.map((item) => (
                      <FoodItemCard
                        key={item.id}
                        item={item}
                        onCustomize={(it) => {
                          setCustomizingItem(it);
                          setSelectedOptions([]);
                          setQuantity(1);
                          setSpecialInstructions("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {menuSearch && filteredMenu.length === 0 && (
              <div className="text-center py-12 animate-fade-up">
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  No items match &ldquo;{menuSearch}&rdquo;
                </p>
                <button
                  onClick={() => setMenuSearch("")}
                  className="mt-2 text-sm font-semibold"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  Clear search
                </button>
              </div>
            )}

            {menu.length === 0 && (
              <div className="text-center py-20 animate-fade-up">
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: "var(--bg-search)" }}>
                  <svg className="w-8 h-8" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Menu not available right now
                </p>
              </div>
            )}
            {/* Spacer for mobile cart bar */}
            {itemCount > 0 && cart.restaurantID === id && (
              <div className="lg:hidden h-24" />
            )}
          </div>

          {/* Cart sidebar (desktop) */}
          {itemCount > 0 && cart.restaurantID === id && (
            <aside
              className="hidden lg:block w-80 shrink-0 sticky top-20 self-start rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-md)",
                maxHeight: "calc(100vh - 6rem)",
              }}
            >
              <div className="p-5">
                <h3 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                  Your Cart
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                  From {cart.restaurantName}
                </p>
              </div>
              <div className="px-5 max-h-64 overflow-y-auto space-y-3">
                {cart.items.map((ci) => (
                  <div key={ci.id} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ background: "var(--bg-search)", color: "var(--text-secondary)" }}
                      >
                        {ci.quantity}
                      </span>
                      <span className="truncate" style={{ color: "var(--text-primary)" }}>
                        {ci.foodItem.name}
                      </span>
                    </div>
                    <span className="font-medium shrink-0 ml-2" style={{ color: "var(--text-primary)" }}>
                      Rs. {Math.round(ci.quantity * ci.foodItem.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t mt-3" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex justify-between font-bold text-sm mb-4" style={{ color: "var(--text-primary)" }}>
                  <span>Subtotal</span>
                  <span>Rs. {Math.round(subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block text-center py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  Checkout • Rs. {Math.round(subtotal)}
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* You might also like */}
      {similarRestaurants.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👀</span>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {similarRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>
      )}

      {/* Customization modal */}
      {customizingItem && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={closeCustomization}
        >
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Customize ${customizingItem.name}`}
            tabIndex={-1}
            className="relative rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md sm:mx-4 animate-fade-up outline-none"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCustomization}
              aria-label="Close customization"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-search)" }}
            >
              <svg className="w-4 h-4" style={{ color: "var(--text-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {customizingItem.imageURL && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                <Image
                  src={customizingItem.imageURL}
                  alt={customizingItem.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            )}

            <h3 className="font-bold text-lg pr-10" style={{ color: "var(--text-primary)" }}>
              {customizingItem.name}
            </h3>
            {customizingItem.description && (
              <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-secondary)" }}>
                {customizingItem.description}
              </p>
            )}

            {(customizingItem.customizationOptions ?? []).length > 0 && (
              <>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>
                  CUSTOMIZE
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                  {(customizingItem.customizationOptions ?? []).map((opt) => {
                    const isSelected = selectedOptions.some((s) => s.id === opt.id);
                    return (
                      <label
                        key={opt.id}
                        className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: isSelected ? "var(--hubb-tint)" : "var(--bg-search)",
                          border: isSelected ? "1px solid var(--hubb-accent)" : "1px solid transparent",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedOptions((p) => p.filter((s) => s.id !== opt.id));
                              } else {
                                setSelectedOptions((p) => [...p, { ...opt, isSelected: true }]);
                              }
                            }}
                            className="w-4 h-4 accent-[var(--hubb-accent)]"
                          />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {opt.name}
                          </span>
                        </div>
                        {opt.additionalCost > 0 && (
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            +Rs. {opt.additionalCost}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </>
            )}

            {/* Special Instructions */}
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>
                SPECIAL INSTRUCTIONS
              </p>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. No onions, extra spicy..."
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl text-sm resize-none"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)", border: "none" }}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Quantity</span>
              <div className="flex items-center rounded-full" style={{ background: "var(--bg-search)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full disabled:opacity-30"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold" style={{ color: "var(--text-primary)" }} aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                addItem(customizingItem, quantity, selectedOptions, specialInstructions);
                showToast(`${customizingItem.name} added to cart`);
                setCustomizingItem(null);
              }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "var(--hubb-accent)" }}
            >
              Add to Cart • Rs.{" "}
              {Math.round(
                quantity * (customizingItem.price +
                  selectedOptions.reduce((s, o) => s + o.additionalCost, 0))
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile cart bar */}
      {itemCount > 0 && cart.restaurantID === id && (
        <div
          className="lg:hidden fixed bottom-16 sm:bottom-0 left-0 right-0 p-3 z-40"
          style={{ background: "color-mix(in srgb, var(--bg-card) 95%, transparent)", backdropFilter: "blur(12px)", boxShadow: "0 -4px 16px rgba(0,0,0,0.1)" }}
        >
          <Link
            href="/checkout"
            className="flex items-center justify-between w-full py-3.5 px-5 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--hubb-accent)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.25)" }}
              >
                {itemCount}
              </span>
              <span>View Cart</span>
            </div>
            <span>Rs. {Math.round(subtotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
