"use client";

import { useCart } from "@/lib/store";
import Link from "next/link";

export default function CartPage() {
  const { cart, subtotal, itemCount, removeItem, updateQuantity, clearCart } =
    useCart();

  if (itemCount === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Your cart is empty
          </h2>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Add items from a restaurant to get started
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = subtotal >= 1000 ? 0 : 99;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Your Cart
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              From {cart.restaurantName}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium"
            style={{ color: "var(--hubb-orange)" }}
          >
            Clear All
          </button>
        </div>

        {/* Items */}
        <div
          className="rounded-2xl divide-y divide-[var(--border-subtle)] overflow-hidden"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {cart.items.map((ci) => (
            <div key={ci.id} className="p-4 flex items-center gap-4">
              {ci.foodItem.imageURL ? (
                <img
                  src={ci.foodItem.imageURL}
                  alt={ci.foodItem.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background: "var(--bg-search)" }}
                >
                  <span className="text-xl">🍽️</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-sm line-clamp-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {ci.foodItem.name}
                </h3>
                {ci.selectedOptions.length > 0 && (
                  <p
                    className="text-xs line-clamp-1 mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {ci.selectedOptions.map((o) => o.name).join(", ")}
                  </p>
                )}
                {ci.specialInstructions && (
                  <p
                    className="text-xs italic mt-0.5 line-clamp-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    &ldquo;{ci.specialInstructions}&rdquo;
                  </p>
                )}
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  Rs.{" "}
                  {Math.round(
                    ci.quantity *
                      (ci.foodItem.price +
                        ci.selectedOptions.reduce(
                          (s, o) => s + o.additionalCost,
                          0
                        ))
                  )}
                </p>
              </div>
              {/* Quantity stepper */}
              <div
                className="flex items-center gap-0 rounded-full overflow-hidden"
                style={{ border: "1px solid var(--border-default)" }}
              >
                <button
                  onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  −
                </button>
                <span
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {ci.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{ color: "var(--hubb-accent)" }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="rounded-2xl p-5 mt-5 space-y-3"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
            <span style={{ color: "var(--text-primary)" }}>
              Rs. {Math.round(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Delivery Fee</span>
            <span
              style={{
                color:
                  deliveryFee === 0
                    ? "var(--hubb-accent)"
                    : "var(--text-primary)",
              }}
            >
              {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Service Fee</span>
            <span style={{ color: "var(--text-primary)" }}>
              Rs. {serviceFee}
            </span>
          </div>
          {deliveryFee === 0 && (
            <p
              className="text-xs text-center py-2 rounded-lg font-medium"
              style={{
                background: "var(--hubb-tint)",
                color: "var(--hubb-green)",
              }}
            >
              Free delivery on orders above Rs. 1,000!
            </p>
          )}
          <div
            className="flex justify-between font-bold text-base pt-3 border-t"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <span>Total</span>
            <span>Rs. {Math.round(total)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="block text-center mt-5 py-4 rounded-2xl text-base font-bold text-white transition-colors"
          style={{ background: "var(--hubb-accent)" }}
        >
          Proceed to Checkout • Rs. {Math.round(total)}
        </Link>
      </div>
    </div>
  );
}
