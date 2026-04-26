"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { useCart } from "@/lib/store";
import { useToast } from "./ToastProvider";
import type { FoodItem } from "@/lib/types";

export default function PopularItems() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    api
      .getFeaturedFoodItems()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.items || [];
        setItems(list.filter((i: FoodItem) => i.isAvailable).slice(0, 8));
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Popular Near You
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {items.map((item) => {
          const discountedPrice =
            item.discountPercentage > 0
              ? item.price * (1 - item.discountPercentage / 100)
              : null;

          return (
            <div
              key={item.id}
              className="shrink-0 w-44 rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={{
                background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="relative">
                {item.imageURL ? (
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-28 flex items-center justify-center"
                    style={{ background: "var(--bg-search)" }}
                  >
                    <span className="text-3xl">🍽️</span>
                  </div>
                )}
                {item.discountPercentage > 0 && (
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--hubb-accent)" }}
                  >
                    {item.discountPercentage}% off
                  </span>
                )}
              </div>
              <div className="p-3">
                <h4
                  className="text-sm font-semibold line-clamp-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </h4>
                <p
                  className="text-xs line-clamp-1 mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {item.restaurantName}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Rs. {Math.round(discountedPrice ?? item.price)}
                    </span>
                    {discountedPrice && (
                      <span
                        className="text-xs line-through"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {Math.round(item.price)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => { addItem(item, 1, [], ""); showToast(`${item.name} added to cart`); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "var(--hubb-accent)" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
