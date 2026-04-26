"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodItemCard from "@/components/FoodItemCard";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import * as api from "@/lib/api";
import Link from "next/link";
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
  const { cart, subtotal, itemCount, addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [detail, menuData] = await Promise.all([
          api.getRestaurantDetail(id),
          api.getRestaurantMenu(id),
        ]);
        setRestaurant(detail);
        const categories = menuData.categories || menuData.menu || menuData || [];
        setMenu(categories);
        if (categories.length > 0) setActiveSection(categories[0].id);
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
        <img
          src={restaurant.imageURL}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-8">
          {/* Menu */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            {menu.length > 0 && (
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
              {menu.map((cat) => (
                <div key={cat.id} id={`section-${cat.id}`}>
                  <h2
                    className="text-lg font-bold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {cat.name}
                  </h2>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <FoodItemCard
                        key={item.id}
                        item={item}
                        onCustomize={(it) => {
                          setCustomizingItem(it);
                          setSelectedOptions([]);
                          setQuantity(1);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

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

      {/* Customization modal */}
      {customizingItem && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setCustomizingItem(null)}
        >
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />
          <div
            className="relative rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md sm:mx-4 animate-fade-up"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setCustomizingItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-search)" }}
            >
              <svg className="w-4 h-4" style={{ color: "var(--text-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {customizingItem.imageURL && (
              <img
                src={customizingItem.imageURL}
                alt={customizingItem.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

            <h3 className="font-bold text-lg pr-10" style={{ color: "var(--text-primary)" }}>
              {customizingItem.name}
            </h3>
            {customizingItem.description && (
              <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-secondary)" }}>
                {customizingItem.description}
              </p>
            )}

            {customizingItem.customizationOptions.length > 0 && (
              <>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-tertiary)" }}>
                  CUSTOMIZE
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                  {customizingItem.customizationOptions.map((opt) => {
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

            {/* Quantity */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Quantity</span>
              <div className="flex items-center rounded-full" style={{ background: "var(--bg-search)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-sm font-bold rounded-full"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                addItem(customizingItem, quantity, selectedOptions, "");
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
