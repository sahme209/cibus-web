"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as api from "@/lib/api";
import type { Restaurant } from "@/lib/types";

const STORAGE_KEY = "hubb_recently_viewed";

function getPreferredCuisines(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const items = JSON.parse(stored);
    const cuisines = items.map((r: any) => r.cuisine).filter(Boolean);
    return [...new Set<string>(cuisines)];
  } catch {
    return [];
  }
}

export default function PickedForYou() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const cuisines = getPreferredCuisines();
    if (cuisines.length === 0) return;

    api
      .getRestaurants(33.6844, 73.0479, 15)
      .then((all) => {
        const matched = all.filter(
          (r: Restaurant) =>
            r.isOpen &&
            cuisines.some((c) =>
              r.cuisine.toLowerCase().includes(c.toLowerCase())
            )
        );
        const picks =
          matched.length >= 3
            ? matched.sort(() => 0.5 - Math.random()).slice(0, 6)
            : all
                .filter((r: Restaurant) => r.isOpen && r.rating >= 4.0)
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);
        setRestaurants(picks);
      })
      .catch(() => {});
  }, []);

  if (restaurants.length < 3) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Picked for You
          </h2>
        </div>
        <Link
          href="/search"
          className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-sm"
          style={{ color: "var(--hubb-accent)", background: "var(--hubb-tint)" }}
        >
          See All
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 stagger-children">
        {restaurants.map((r) => (
          <Link
            key={`picked-${r.id}`}
            href={`/restaurant/${r.id}`}
            className="shrink-0 w-52 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="relative h-32">
              {r.imageURL && (
                <Image
                  src={r.imageURL}
                  alt={r.name}
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {r.deliveryFee === 0 && (
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: "rgba(0,112,74,0.9)" }}
                >
                  Free delivery
                </span>
              )}
              <div
                className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                style={{
                  background:
                    r.rating >= 4.5
                      ? "rgba(0,112,74,0.9)"
                      : "rgba(0,0,0,0.5)",
                }}
              >
                {r.rating.toFixed(1)}
              </div>
              <div className="absolute bottom-2 left-2">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                  style={{
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                  }}
                >
                  {r.deliveryTime}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p
                className="text-sm font-bold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {r.name}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                {r.cuisine}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
