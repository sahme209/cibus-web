"use client";

import Link from "next/link";
import Image from "next/image";
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
              aria-label="Featured restaurant"
              className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide backdrop-blur-sm"
              style={{ background: "rgba(0,112,74,0.9)" }}
            >
              FEATURED
            </span>
          )}
          {restaurant.deliveryFee === 0 && (
            <span
              role="listitem"
              aria-label="Free delivery"
              className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white backdrop-blur-sm"
              style={{ background: "rgba(0,112,74,0.9)" }}
            >
              Rs. 0 delivery
            </span>
          )}
        </div>
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
        <div className="absolute bottom-3 left-3">
          <span
            className="px-2.5 py-1 rounded-md text-xs font-bold"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "var(--shadow-sm)" }}
            aria-label={`Delivery time ${restaurant.deliveryTime}`}
          >
            {restaurant.deliveryTime}
          </span>
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
