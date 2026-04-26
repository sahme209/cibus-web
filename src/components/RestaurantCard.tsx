"use client";

import Link from "next/link";
import type { Restaurant } from "@/lib/types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
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
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {restaurant.isFeatured && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wide"
            style={{ background: "var(--hubb-accent)" }}
          >
            FEATURED
          </span>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-bold text-sm px-4 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              Currently Closed
            </span>
          </div>
        )}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {restaurant.deliveryTime}
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-bold text-[15px] line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            {restaurant.name}
          </h3>
          <div
            className="flex items-center gap-0.5 shrink-0 px-2 py-0.5 rounded-md text-xs font-bold"
            style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
          >
            <span style={{ color: "var(--hubb-gold)" }}>★</span>
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        <p
          className="text-xs mt-1 line-clamp-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          {restaurant.cuisine} • {restaurant.distance}
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
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
              className="text-[11px]"
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
