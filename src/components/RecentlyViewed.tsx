"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ViewedRestaurant {
  id: string;
  name: string;
  imageURL: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  viewedAt: number;
}

const STORAGE_KEY = "hubb_recently_viewed";
const MAX_ITEMS = 8;

export function saveRecentlyViewed(restaurant: {
  id: string;
  name: string;
  imageURL: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items: ViewedRestaurant[] = stored ? JSON.parse(stored) : [];
    const filtered = items.filter((r) => r.id !== restaurant.id);
    filtered.unshift({ ...restaurant, viewedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage quota or parse error
  }
}

export default function RecentlyViewed() {
  const [restaurants, setRestaurants] = useState<ViewedRestaurant[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: ViewedRestaurant[] = JSON.parse(stored);
        setRestaurants(items.slice(0, 6));
      }
    } catch {
      // ignore
    }
  }, []);

  if (restaurants.length < 2) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕐</span>
          <h2
            className="text-xl sm:text-2xl font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Recently Viewed
          </h2>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 stagger-children">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurant/${r.id}`}
            className="shrink-0 w-40 rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="relative h-24">
              {r.imageURL ? (
                <Image
                  src={r.imageURL}
                  alt={r.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "var(--bg-search)" }}
                >
                  <span className="text-2xl">🍽️</span>
                </div>
              )}
              {r.rating > 0 && (
                <div
                  className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                  style={{ background: r.rating >= 4.5 ? "rgba(0,112,74,0.9)" : "rgba(0,0,0,0.5)" }}
                >
                  {r.rating.toFixed(1)}
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {r.name}
              </p>
              <p
                className="text-[11px] truncate"
                style={{ color: "var(--text-tertiary)" }}
              >
                {r.cuisine} • {r.deliveryTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
