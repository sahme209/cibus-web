"use client";

import Image from "next/image";
import type { FoodItem } from "@/lib/types";
import { useCart } from "@/lib/store";
import { useToast } from "./ToastProvider";

export default function FoodItemCard({
  item,
  onCustomize,
}: {
  item: FoodItem;
  onCustomize?: (item: FoodItem) => void;
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const options = item.customizationOptions ?? [];

  const handleAdd = () => {
    if (options.length > 0 && onCustomize) {
      onCustomize(item);
      return;
    }
    addItem(item, 1, [], "");
    showToast(`${item.name} added to cart`);
  };

  const discountedPrice =
    item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : null;

  return (
    <div
      className="flex gap-4 p-4 rounded-2xl transition-all hover:shadow-md group cursor-pointer"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
      onClick={handleAdd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleAdd(); }}
      aria-label={item.isAvailable ? `Add ${item.name} to cart — Rs. ${Math.round(discountedPrice ?? item.price)}` : `${item.name} — not available`}
    >
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className="font-bold text-sm line-clamp-1"
              style={{ color: "var(--text-primary)" }}
            >
              {item.name}
            </h4>
            {item.isPopular && (
              <span
                className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: "#FF300815", color: "#FF3008" }}
              >
                Popular
              </span>
            )}
          </div>
          {item.description && (
            <p
              className="text-xs mt-1 line-clamp-2 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.description}
            </p>
          )}

          {/* Rating */}
          {item.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill={i < Math.round(item.rating) ? "var(--hubb-gold)" : "var(--bg-search)"}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                {item.rating.toFixed(1)}
                {item.reviewCount > 0 && ` (${item.reviewCount})`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2.5">
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            Rs. {Math.round(discountedPrice ?? item.price)}
          </span>
          {discountedPrice && (
            <span
              className="text-xs line-through"
              style={{ color: "var(--text-tertiary)" }}
            >
              Rs. {Math.round(item.price)}
            </span>
          )}
          {item.discountPercentage > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "#FF300815", color: "#FF3008" }}
            >
              {item.discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Image + Add */}
      <div className="relative shrink-0">
        {item.imageURL ? (
          <Image
            src={item.imageURL}
            alt={item.name}
            width={128}
            height={112}
            className="w-32 h-28 rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="w-32 h-28 rounded-xl flex items-center justify-center"
            style={{ background: "var(--bg-search)" }}
          >
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); handleAdd(); }}
          disabled={!item.isAvailable}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:shadow-none"
          style={{
            background: item.isAvailable ? "var(--hubb-accent)" : "var(--bg-search)",
            color: item.isAvailable ? "white" : "var(--text-tertiary)",
            boxShadow: item.isAvailable ? "0 2px 8px rgba(0,112,74,0.3)" : "none",
          }}
          aria-label={item.isAvailable ? `Add ${item.name} to cart` : `${item.name} not available`}
        >
          {item.isAvailable ? (options.length > 0 ? "ADD +" : "ADD") : "N/A"}
        </button>
      </div>
    </div>
  );
}
