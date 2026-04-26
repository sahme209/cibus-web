"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";
import * as api from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

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
        <div className="text-center">
          <p className="text-5xl mb-4">📋</p>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Sign in to view orders
          </h2>
          <Link
            href="/auth"
            className="inline-block mt-4 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--cibus-accent)" }}
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
                background:
                  tab === t ? "var(--bg-card)" : "transparent",
                color:
                  tab === t
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t === "active" ? `Active (${activeOrders.length})` : `Past (${pastOrders.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse space-y-3"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="h-4 w-48 rounded" style={{ background: "var(--bg-search)" }} />
                <div className="h-3 w-32 rounded" style={{ background: "var(--bg-search)" }} />
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
              return (
                <Link
                  key={order.id}
                  href={
                    tab === "active"
                      ? `/tracking/${order.id}`
                      : `/orders`
                  }
                  className="block rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--bg-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {order.restaurantImageURL ? (
                        <img
                          src={order.restaurantImageURL}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: "var(--bg-search)" }}
                        >
                          <span className="text-lg">🍽️</span>
                        </div>
                      )}
                      <div>
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {order.restaurantName}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""} • Rs.{" "}
                          {Math.round(order.total)}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {new Date(order.placedAt).toLocaleDateString(
                            "en-PK",
                            {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">
              {tab === "active" ? "🚀" : "📋"}
            </p>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {tab === "active"
                ? "No active orders"
                : "No past orders yet"}
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
                className="inline-block mt-4 px-6 py-3 rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--cibus-accent)" }}
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
