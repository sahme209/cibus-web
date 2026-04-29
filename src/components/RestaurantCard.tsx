"use client";

import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/lib/store";
import type { Restaurant } from "@/lib/types";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(restaurant.id);
  const priceIndicator = restaurant.minimumOrder < 500 ? "$" : restaurant.minimumOrder < 1000 ? "$$" : "$$$";

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block rounded-2xl card-hover"
      style={{
        background: "var(--bg-card)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid color-mix(in srgb, var(--border-default) 50%, transparent)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Image
          src={restaurant.imageURL}
          alt={restaurant.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5" role="list" aria-label="Restaurant badges">
          {restaurant.isFeatured && (
            <span
              role="listitem"
              aria-label="Promoted restaurant"
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white backdrop-blur-sm flex items-center gap-1"
              style={{ background: "rgba(0,0,0,0.55)" }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Promoted
            </span>
          )}
          {restaurant.deliveryFee === 0 && (
            <span
              role="listitem"
              aria-label="Free delivery"
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-sm"
              style={{ background: "rgba(0,112,74,0.9)" }}
            >
              Rs. 0 delivery
            </span>
          )}
        </div>
        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(restaurant.id); }}
          className="absolute top-3 right-12 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
          style={{ background: saved ? "rgba(255,59,48,0.15)" : "rgba(255,255,255,0.85)" }}
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
        >
          <svg className="w-4 h-4" style={{ color: saved ? "#FF3B30" : "var(--text-secondary)" }} fill={saved ? "#FF3B30" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold backdrop-blur-sm"
          style={{
            background: restaurant.rating >= 4.5 ? "rgba(0,112,74,0.9)" : "rgba(0,0,0,0.5)",
            color: "white",
          }}
          aria-label={`Rating ${restaurant.rating.toFixed(1)} out of 5`}
        >
          {restaurant.rating.toFixed(1)}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span
            className="px-2.5 py-1 rounded-md text-xs font-bold"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "var(--shadow-sm)" }}
            aria-label={`Delivery time ${restaurant.deliveryTime}`}
          >
            {restaurant.deliveryTime}
          </span>
          {parseInt(restaurant.deliveryTime) > 40 && restaurant.isOpen && (
            <span className="px-2 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: "rgba(255,120,0,0.85)" }}>
              Busy
            </span>
          )}
        </div>
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]" aria-label="Restaurant currently closed">
            <span className="text-white font-bold text-sm px-4 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              Currently Closed
            </span>
          </div>
        )}
      </div>

      {/* Details — DoorDash-style */}
      <div className="p-3.5">
        <h3
          className="font-bold text-[15px] line-clamp-1"
          style={{ color: "var(--text-primary)" }}
        >
          {restaurant.name}
        </h3>
        <p
          className="text-sm mt-1 flex items-center gap-1.5 flex-wrap"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{restaurant.cuisine}</span>
          <span style={{ color: "var(--text-tertiary)" }}>•</span>
          <span>{restaurant.distance}</span>
          <span style={{ color: "var(--text-tertiary)" }}>•</span>
          <span style={{ color: "var(--text-tertiary)" }}>{priceIndicator}</span>
          {restaurant.deliveryFee > 0 && (
            <>
              <span style={{ color: "var(--text-tertiary)" }}>•</span>
              <span>Rs. {restaurant.deliveryFee} delivery</span>
            </>
          )}
        </p>
        {restaurant.deliveryFee === 0 && (
          <p className="text-sm mt-0.5">
            <span style={{ color: "var(--hubb-accent)" }} className="font-medium">Free delivery</span>
            {restaurant.minimumOrder > 0 && (
              <span style={{ color: "var(--text-tertiary)" }}> • Min. Rs. {restaurant.minimumOrder}</span>
            )}
          </p>
        )}
        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 overflow-hidden">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                style={{ background: "var(--bg-search)", color: "var(--text-tertiary)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
