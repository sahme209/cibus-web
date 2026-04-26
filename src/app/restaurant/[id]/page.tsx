"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodItemCard from "@/components/FoodItemCard";
import { useCart } from "@/lib/store";
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
  const { cart, subtotal, itemCount, addItem } = useCart();

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
        <div className="animate-pulse">
          <div className="h-64" style={{ background: "var(--bg-search)" }} />
          <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
            <div className="h-8 w-64 rounded-lg" style={{ background: "var(--bg-search)" }} />
            <div className="h-4 w-48 rounded-lg" style={{ background: "var(--bg-search)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Restaurant not found
          </h2>
          <Link href="/" className="text-sm mt-2 inline-block" style={{ color: "var(--hubb-accent)" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={restaurant.imageURL}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
              <span>★ {restaurant.rating.toFixed(1)} ({restaurant.reviewCount})</span>
              <span>•</span>
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span>{restaurant.deliveryTime}</span>
              <span>•</span>
              <span>
                {restaurant.deliveryFee === 0
                  ? "Free Delivery"
                  : `Rs. ${restaurant.deliveryFee} delivery`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Menu */}
          <div className="flex-1 min-w-0">
            {/* Category tabs */}
            {menu.length > 0 && (
              <div
                className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 sticky top-16 z-10 pt-2 -mx-4 px-4"
                style={{ background: "var(--bg-secondary)" }}
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
                    className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    style={{
                      background:
                        activeSection === cat.id
                          ? "var(--text-primary)"
                          : "var(--bg-card)",
                      color:
                        activeSection === cat.id
                          ? "var(--bg-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {cat.name} ({cat.items.length})
                  </button>
                ))}
              </div>
            )}

            {/* Sections */}
            <div className="space-y-8 mt-4">
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
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {menu.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Menu not available right now
                </p>
              </div>
            )}
          </div>

          {/* Cart sidebar (desktop) */}
          {itemCount > 0 && cart.restaurantID === id && (
            <aside
              className="hidden lg:block w-80 shrink-0 sticky top-20 self-start rounded-2xl p-5"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-md)",
                maxHeight: "calc(100vh - 6rem)",
                overflow: "auto",
              }}
            >
              <h3 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                Your Cart
              </h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                From {cart.restaurantName}
              </p>
              <div className="space-y-3">
                {cart.items.map((ci) => (
                  <div key={ci.id} className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-primary)" }}>
                      {ci.quantity}× {ci.foodItem.name}
                    </span>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                      Rs. {Math.round(ci.quantity * ci.foodItem.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 pt-4 border-t flex justify-between font-bold text-sm"
                style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
              >
                <span>Subtotal</span>
                <span>Rs. {Math.round(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-4 block text-center py-3 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ background: "var(--hubb-accent)" }}
              >
                Checkout • Rs. {Math.round(subtotal)}
              </Link>
            </aside>
          )}
        </div>
      </div>

      {/* Customization modal */}
      {customizingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setCustomizingItem(null)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md mx-4"
            style={{ background: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
              {customizingItem.name}
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Customize your order
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {customizingItem.customizationOptions.map((opt) => {
                const isSelected = selectedOptions.some((s) => s.id === opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: isSelected ? "var(--hubb-tint)" : "var(--bg-search)",
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
            <button
              onClick={() => {
                addItem(customizingItem, 1, selectedOptions, "");
                setCustomizingItem(null);
              }}
              className="mt-5 w-full py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--hubb-accent)" }}
            >
              Add to Cart • Rs.{" "}
              {Math.round(
                customizingItem.price +
                  selectedOptions.reduce((s, o) => s + o.additionalCost, 0)
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile cart bar */}
      {itemCount > 0 && cart.restaurantID === id && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40"
          style={{ background: "var(--bg-card)", boxShadow: "0 -4px 16px rgba(0,0,0,0.1)" }}
        >
          <Link
            href="/checkout"
            className="flex items-center justify-between w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm"
            style={{ background: "var(--hubb-accent)" }}
          >
            <span>View Cart • {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            <span>Rs. {Math.round(subtotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
