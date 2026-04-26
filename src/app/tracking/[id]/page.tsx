"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
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
  const [cancelling, setCancelling] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const { showToast } = useToast();

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
      <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <div className="h-8 w-56 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-32 rounded skeleton-shimmer" />
          <div className="h-32 rounded-2xl skeleton-shimmer" />
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg-card)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full skeleton-shimmer" />
                <div className="flex-1 pt-2.5">
                  <div className="h-4 w-28 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--bg-search)" }}>
            <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Order not found
          </h2>
          <Link
            href="/orders"
            className="inline-block mt-4 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = order.status === "placed" || order.status === "confirmed";

  async function handleCancel() {
    setCancelling(true);
    try {
      await api.cancelOrder(id);
      setOrder((prev) => prev ? { ...prev, status: "cancelled" } : prev);
      showToast("Order cancelled successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to cancel order", "error");
    } finally {
      setCancelling(false);
    }
  }

  async function handleRate() {
    if (rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }
    setSubmittingRating(true);
    try {
      await api.rateOrder(id, { rating, comment: ratingComment || undefined });
      setRatingSubmitted(true);
      showToast("Thanks for your feedback!");
    } catch (err: any) {
      showToast(err.message || "Failed to submit rating", "error");
    } finally {
      setSubmittingRating(false);
    }
  }

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-up">
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
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full animate-ping opacity-50" style={{ background: "var(--hubb-accent)" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "var(--hubb-accent)" }} />
            </div>
          )}
        </div>

        {/* ETA Card */}
        {!isDelivered && !isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6 text-center animate-fade-up"
            style={{ background: "var(--text-primary)" }}
          >
            <p className="text-sm text-white/60">Estimated Delivery</p>
            <p className="text-3xl font-bold text-white mt-1">
              {order.estimatedDelivery
                ? new Date(order.estimatedDelivery).toLocaleTimeString("en-PK", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Calculating..."}
            </p>
            {tracking?.riderName && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--hubb-accent)" }}>
                  <span className="text-white">🛵</span>
                </div>
                <span className="text-sm text-white/70">
                  {tracking.riderName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Progress Steps */}
        {!isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6 animate-fade-up"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="space-y-0">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all"
                        style={{
                          background: isCompleted ? "var(--hubb-accent)" : "var(--bg-search)",
                          boxShadow: isCurrent ? "0 0 0 4px var(--hubb-tint)" : "none",
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
                          className="w-0.5 h-8 my-1 transition-colors"
                          style={{
                            background: isCompleted ? "var(--hubb-accent)" : "var(--border-default)",
                          }}
                        />
                      )}
                    </div>
                    <div className="pt-2.5">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: isCompleted ? "var(--text-primary)" : "var(--text-tertiary)",
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
            className="rounded-2xl p-6 mb-6 text-center animate-fade-up"
            style={{ background: "#FFE5E3" }}
          >
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: "rgba(255,59,48,0.1)" }}>
              <svg className="w-7 h-7" style={{ color: "#FF3B30" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-semibold text-sm" style={{ color: "#FF3B30" }}>
              This order has been cancelled
            </p>
          </div>
        )}

        {/* Delivered success */}
        {isDelivered && (
          <div
            className="rounded-2xl p-6 mb-6 text-center animate-fade-up"
            style={{ background: "var(--hubb-tint)" }}
          >
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: "rgba(6,193,103,0.15)" }}>
              <svg className="w-7 h-7" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-sm" style={{ color: "var(--hubb-green)" }}>
              Your order has been delivered!
            </p>
          </div>
        )}

        {/* Order details */}
        <div
          className="rounded-2xl p-5 animate-fade-up"
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
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: "var(--bg-search)", color: "var(--text-secondary)" }}
                  >
                    {ci.quantity}
                  </span>
                  <span className="truncate" style={{ color: "var(--text-secondary)" }}>
                    {ci.foodItem.name}
                  </span>
                </div>
                <span className="shrink-0 ml-2" style={{ color: "var(--text-primary)" }}>
                  Rs. {Math.round(ci.quantity * ci.foodItem.price)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="mt-4 pt-4 border-t space-y-1.5"
            style={{ borderColor: "var(--border-default)" }}
          >
            {order.deliveryFee !== undefined && (
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-tertiary)" }}>Delivery</span>
                <span style={{ color: order.deliveryFee === 0 ? "var(--hubb-accent)" : "var(--text-secondary)" }}>
                  {order.deliveryFee === 0 ? "FREE" : `Rs. ${order.deliveryFee}`}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1.5" style={{ color: "var(--text-primary)" }}>
              <span>Total</span>
              <span>Rs. {Math.round(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Cancel Order */}
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full mt-5 py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50 animate-fade-up"
            style={{
              background: "var(--bg-card)",
              color: "var(--hubb-orange)",
              border: "1px solid var(--border-default)",
            }}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {/* Rating UI */}
        {isDelivered && !ratingSubmitted && (
          <div
            className="rounded-2xl p-5 mt-5 animate-fade-up"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
              How was your order?
            </h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl transition-transform hover:scale-110"
                  style={{ opacity: star <= rating ? 1 : 0.25 }}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Any feedback? (optional)"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              style={{
                background: "var(--bg-search)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            <button
              onClick={handleRate}
              disabled={submittingRating || rating === 0}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: "var(--hubb-accent)" }}
            >
              {submittingRating ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        )}
        {isDelivered && ratingSubmitted && (
          <div
            className="rounded-2xl p-5 mt-5 text-center animate-fade-up"
            style={{ background: "var(--hubb-tint)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--hubb-green)" }}>
              Thank you for your feedback!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3 animate-fade-up">
          <Link
            href="/orders"
            className="flex-1 text-center py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
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
            className="flex-1 text-center py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--hubb-accent)" }}
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
