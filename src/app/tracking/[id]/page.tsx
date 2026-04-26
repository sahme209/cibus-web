"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as api from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "placed", label: "Order Placed", icon: "📝" },
  { status: "confirmed", label: "Confirmed", icon: "✅" },
  { status: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { status: "ready_for_pickup", label: "Ready for Pickup", icon: "📦" },
  { status: "on_the_way", label: "On the Way", icon: "🛵" },
  { status: "delivered", label: "Delivered", icon: "🎉" },
];

function getStepIndex(status: OrderStatus): number {
  const idx = STEPS.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : 0;
}

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [orderData, trackData] = await Promise.allSettled([
          api.getOrderDetail(id),
          api.getOrderTracking(id),
        ]);
        if (orderData.status === "fulfilled") setOrder(orderData.value);
        if (trackData.status === "fulfilled") setTracking(trackData.value);
      } catch {
        // handled by null state
      } finally {
        setLoading(false);
      }
    }
    load();

    const interval = setInterval(async () => {
      try {
        const [orderData, trackData] = await Promise.allSettled([
          api.getOrderDetail(id),
          api.getOrderTracking(id),
        ]);
        if (orderData.status === "fulfilled") setOrder(orderData.value);
        if (trackData.status === "fulfilled") setTracking(trackData.value);
      } catch {
        // silent refresh
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded-lg" style={{ background: "var(--bg-search)" }} />
            <div className="h-48 rounded-2xl" style={{ background: "var(--bg-search)" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Order not found
          </h2>
          <Link
            href="/orders"
            className="text-sm mt-2 inline-block"
            style={{ color: "var(--cibus-accent)" }}
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {isDelivered ? "Order Delivered!" : isCancelled ? "Order Cancelled" : "Track Your Order"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
          {!isDelivered && !isCancelled && (
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ background: "var(--cibus-accent)" }}
            />
          )}
        </div>

        {/* ETA Card */}
        {!isDelivered && !isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "var(--text-primary)" }}
          >
            <p className="text-sm text-white/70">Estimated Delivery</p>
            <p className="text-3xl font-bold text-white mt-1">
              {order.estimatedDelivery
                ? new Date(order.estimatedDelivery).toLocaleTimeString("en-PK", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Calculating..."}
            </p>
            {tracking?.riderName && (
              <p className="text-sm text-white/70 mt-2">
                Rider: {tracking.riderName}
              </p>
            )}
          </div>
        )}

        {/* Progress Steps */}
        {!isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="space-y-0">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={step.status} className="flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all"
                        style={{
                          background: isCompleted
                            ? "var(--cibus-accent)"
                            : "var(--bg-search)",
                          boxShadow: isCurrent
                            ? "0 0 0 4px var(--cibus-tint)"
                            : "none",
                        }}
                      >
                        {isCompleted ? (
                          <span className="text-white text-sm">
                            {isCurrent ? step.icon : "✓"}
                          </span>
                        ) : (
                          <span style={{ opacity: 0.4 }}>{step.icon}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 h-8 my-1"
                          style={{
                            background: isCompleted
                              ? "var(--cibus-accent)"
                              : "var(--border-default)",
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="pt-2.5">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: isCompleted
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                        }}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "#FFE5E3" }}
          >
            <p className="text-4xl mb-2">❌</p>
            <p className="font-semibold text-sm" style={{ color: "#FF3B30" }}>
              This order has been cancelled
            </p>
          </div>
        )}

        {/* Order details */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-3 mb-4">
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
                <span>🍽️</span>
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                {order.restaurantName}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((ci, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  {ci.quantity}× {ci.foodItem.name}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  Rs. {Math.round(ci.quantity * ci.foodItem.price)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-4 pt-4 border-t flex justify-between font-bold text-sm"
            style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
          >
            <span>Total</span>
            <span>Rs. {Math.round(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            href="/orders"
            className="flex-1 text-center py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            All Orders
          </Link>
          <Link
            href="/"
            className="flex-1 text-center py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--cibus-accent)" }}
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
