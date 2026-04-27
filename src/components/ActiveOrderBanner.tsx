"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import * as api from "@/lib/api";

interface ActiveOrder {
  id: string;
  status: string;
  restaurantName: string;
  estimatedDelivery?: string;
}

const STATUS_LABELS: Record<string, string> = {
  placed: "Order placed",
  confirmed: "Restaurant confirmed",
  preparing: "Being prepared",
  ready_for_pickup: "Ready for pickup",
  on_the_way: "On the way",
};

const STATUS_PROGRESS: Record<string, number> = {
  placed: 10,
  confirmed: 25,
  preparing: 50,
  ready_for_pickup: 70,
  on_the_way: 85,
};

export default function ActiveOrderBanner() {
  const { isLoggedIn } = useAuth();
  const [order, setOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;

    async function check() {
      try {
        const orders = await api.getActiveOrders();
        if (!cancelled && orders.length > 0) {
          const o = orders[0];
          setOrder({
            id: o.id,
            status: o.status,
            restaurantName: o.restaurantName,
            estimatedDelivery: o.estimatedDelivery,
          });
        } else if (!cancelled) {
          setOrder(null);
        }
      } catch {
        // silent
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  if (!order) return null;

  const eta = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const progress = STATUS_PROGRESS[order.status] || 10;

  return (
    <Link
      href={`/tracking/${order.id}`}
      className="block w-full relative overflow-hidden"
      style={{ background: "var(--hubb-primary)" }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full transition-all duration-700"
          style={{ background: "var(--hubb-accent)", width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2.5 h-2.5 rounded-full animate-ping" style={{ background: "var(--hubb-accent)" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--hubb-accent)" }} />
          </div>
          <span className="text-white text-sm font-medium">
            {STATUS_LABELS[order.status] || order.status} — {order.restaurantName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {eta && (
            <span className="text-white/70 text-xs hidden sm:inline">
              ETA {eta}
            </span>
          )}
          <span
            className="text-xs font-bold px-3 py-1 rounded-full transition-all hover:scale-105"
            style={{ background: "var(--hubb-accent)", color: "white" }}
          >
            Track →
          </span>
        </div>
      </div>
    </Link>
  );
}
