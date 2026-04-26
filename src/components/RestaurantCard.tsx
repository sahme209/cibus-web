"use client";

import Link from "next/link";
import type { Restaurant } from "@/lib/types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={restaurant.imageURL}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {restaurant.isFeatured && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            Featured
          </span>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Currently Closed</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-black/70 backdrop-blur-sm">
          {restaurant.deliveryTime}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-base line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            {restaurant.name}
          </h3>
          <div
            className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-xs font-bold"
            style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
          >
            <span>★</span>
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        <p
          className="text-sm mt-1 line-clamp-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {restaurant.cuisine} • {restaurant.distance}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: restaurant.deliveryFee === 0 ? "var(--hubb-tint)" : "var(--bg-search)",
              color: restaurant.deliveryFee === 0 ? "var(--hubb-green)" : "var(--text-secondary)",
            }}
          >
            {restaurant.deliveryFee === 0
              ? "Free Delivery"
              : `Rs. ${restaurant.deliveryFee} delivery`}
          </span>
          {restaurant.minimumOrder > 0 && (
            <span
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Min. Rs. {restaurant.minimumOrder}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
