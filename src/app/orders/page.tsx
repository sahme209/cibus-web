"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import * as api from "@/lib/api";
import type { Order } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  placed: { label: "Placed", color: "#FF9500", bg: "#FFF4E6" },
  confirmed: { label: "Confirmed", color: "#06C167", bg: "#E8F5EE" },
  preparing: { label: "Preparing", color: "#FF6B35", bg: "#FFF0EB" },
  ready_for_pickup: { label: "Ready", color: "#5856D6", bg: "#EEEEFC" },
  on_the_way: { label: "On the Way", color: "#06C167", bg: "#E8F5EE" },
  delivered: { label: "Delivered", color: "#34C759", bg: "#E8F9ED" },
  cancelled: { label: "Cancelled", color: "#FF3B30", bg: "#FFE5E3" },
};

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "past">("active");

  useEffect(() => {
    if (!isLoggedIn) return;
    async function load() {
      try {
        const [active, history] = await Promise.allSettled([
          api.getActiveOrders(),
          api.getOrderHistory(1, 50),
        ]);
        if (active.status === "fulfilled") setActiveOrders(active.value);
        if (history.status === "fulfilled") {
          const delivered = history.value.filter(
            (o: any) => o.status === "delivered" || o.status === "cancelled"
          );
          setPastOrders(delivered);
        }
      } catch {
        // handled by empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center animate-fade-up">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: "var(--bg-search)" }}
          >
            <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Sign in to view orders
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Track your active and past orders
          </p>
          <Link
            href="/auth"
            className="inline-block mt-5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const orders = tab === "active" ? activeOrders : pastOrders;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          My Orders
        </h1>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: "var(--bg-search)" }}
        >
          {(["active", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t ? "var(--bg-card)" : "transparent",
                color: tab === t ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t === "active" ? `Active${!loading ? ` (${activeOrders.length})` : ""}` : `Past${!loading ? ` (${pastOrders.length})` : ""}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: "var(--bg-card)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded skeleton-shimmer" />
                    <div className="h-3 w-28 rounded skeleton-shimmer" />
                  </div>
                  <div className="h-6 w-16 rounded-full skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-3 stagger-children">
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
              return (
                <Link
                  key={order.id}
                  href={tab === "active" ? `/tracking/${order.id}` : `/orders`}
                  className="block rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: "var(--bg-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {order.restaurantImageURL ? (
                        <img
                          src={order.restaurantImageURL}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "var(--bg-search)" }}
                        >
                          <span className="text-lg">🍽️</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3
                          className="font-semibold text-sm truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {order.restaurantName}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""} • Rs. {Math.round(order.total)}
                        </p>
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {new Date(order.placedAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {tab === "active" && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--hubb-accent)" }} />
                        <span className="text-xs font-medium" style={{ color: "var(--hubb-accent)" }}>
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--hubb-accent)" }}>
                        Track →
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-up">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: "var(--bg-search)" }}
            >
              <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {tab === "active" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                )}
              </svg>
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {tab === "active" ? "No active orders" : "No past orders yet"}
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {tab === "active"
                ? "Your active orders will appear here"
                : "Start ordering to build your history"}
            </p>
            {tab === "active" && (
              <Link
                href="/"
                className="inline-block mt-5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Browse Restaurants
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
