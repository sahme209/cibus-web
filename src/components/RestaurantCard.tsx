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
        {restaurant.isFeatured && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide"
            style={{ background: "var(--hubb-accent)" }}
          >
            FEATURED
          </span>
        )}
        {restaurant.deliveryFee === 0 && (
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            Rs. 0 delivery
          </span>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-bold text-sm px-4 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              Currently Closed
            </span>
          </div>
        )}
      </div>

      {/* Details — DoorDash-style */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-bold text-[15px] line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            {restaurant.name}
          </h3>
          <div
            className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full text-xs font-bold"
            style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
          >
            {restaurant.rating.toFixed(1)}
          </div>
        </div>
        <p
          className="text-sm mt-1 flex items-center gap-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{restaurant.deliveryTime}</span>
          <span style={{ color: "var(--text-tertiary)" }}>•</span>
          <span>{restaurant.cuisine}</span>
          <span style={{ color: "var(--text-tertiary)" }}>•</span>
          <span>{restaurant.distance}</span>
        </p>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {restaurant.deliveryFee === 0 ? (
            <span style={{ color: "var(--hubb-accent)" }} className="font-medium">Rs. 0 delivery fee</span>
          ) : (
            <span>Rs. {restaurant.deliveryFee} delivery fee</span>
          )}
          {restaurant.minimumOrder > 0 && (
            <>
              <span style={{ color: "var(--text-tertiary)" }}> • </span>
              <span>Min. Rs. {restaurant.minimumOrder}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
