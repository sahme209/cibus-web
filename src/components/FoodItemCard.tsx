"use client";

import type { FoodItem } from "@/lib/types";
import { useCart } from "@/lib/store";

export default function FoodItemCard({
  item,
  onCustomize,
}: {
  item: FoodItem;
  onCustomize?: (item: FoodItem) => void;
}) {
  const { addItem } = useCart();

  const handleAdd = () => {
    if (item.customizationOptions.length > 0 && onCustomize) {
      onCustomize(item);
      return;
    }
    addItem(item, 1, [], "");
  };

  const discountedPrice =
    item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : null;

  return (
    <div
      className="flex gap-4 p-4 rounded-xl transition-colors"
      style={{ background: "var(--bg-card)" }}
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className="font-semibold text-sm line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            {item.name}
          </h4>
          {item.isPopular && (
            <span
              className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "var(--hubb-tint)", color: "var(--hubb-green)" }}
            >
              Popular
            </span>
          )}
        </div>
        <p
          className="text-xs mt-1 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
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
              className="text-xs font-semibold"
              style={{ color: "var(--hubb-accent)" }}
            >
              {item.discountPercentage}% off
            </span>
          )}
        </div>
      </div>

      {/* Image + Add */}
      <div className="relative shrink-0 w-28">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.name}
            className="w-28 h-24 rounded-lg object-cover"
          />
        ) : (
          <div
            className="w-28 h-24 rounded-lg flex items-center justify-center"
            style={{ background: "var(--bg-search)" }}
          >
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold border-2 transition-colors disabled:opacity-50"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--hubb-accent)",
            color: "var(--hubb-accent)",
          }}
        >
          {item.isAvailable ? "ADD" : "N/A"}
        </button>
      </div>
    </div>
  );
}
