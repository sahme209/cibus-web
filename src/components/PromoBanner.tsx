"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";

interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPct?: number;
  discountAmount?: number;
}

export default function PromoBanner() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api
      .getPromotions()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.promotions || [];
        setPromos(list.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % promos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [promos.length]);

  if (promos.length === 0) return null;

  const promo = promos[current];

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, var(--hubb-accent, var(--hubb-accent, #06C167)) 0%, #00704A 100%)",
      }}
    >
      <div className="px-6 py-5 flex items-center justify-between relative z-10">
        <div>
          <p className="text-white font-bold text-base sm:text-lg">
            {promo.title || "Special Offer!"}
          </p>
          <p className="text-white/80 text-sm mt-0.5">
            {promo.description || "Save on your next order"}
          </p>
        </div>
        {promo.code && (
          <div className="shrink-0 ml-4">
            <div
              className="px-4 py-2 rounded-lg text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px dashed rgba(255,255,255,0.5)",
              }}
            >
              {promo.code}
            </div>
          </div>
        )}
      </div>
      {/* Dots */}
      {promos.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-3">
          {promos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: i === current ? "white" : "rgba(255,255,255,0.4)",
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>
      )}
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
    </div>
  );
}
