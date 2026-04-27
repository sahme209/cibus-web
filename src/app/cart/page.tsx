"use client";

import Image from "next/image";
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
        <div className="text-center animate-fade-up mx-4 max-w-sm">
          <div className="relative mx-auto w-28 h-28 mb-6">
            <div className="absolute inset-0 rounded-full opacity-15 blur-2xl" style={{ background: "var(--hubb-accent)" }} />
            <div className="relative w-28 h-28 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--bg-search)" }}>
              <svg className="w-14 h-14" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Your cart is empty
          </h2>
          <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Looks like you haven&apos;t added anything yet. Start exploring restaurants to find something you love.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
              {itemCount} item{itemCount !== 1 ? "s" : ""} from {cart.restaurantName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {cart.restaurantID && (
              <Link
                href={`/restaurant/${cart.restaurantID}`}
                className="text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: "var(--hubb-accent)" }}
              >
                + Add Items
              </Link>
            )}
            <button
              onClick={clearCart}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--hubb-orange)" }}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Estimated delivery + free delivery progress */}
        <div className="flex gap-3 mb-5">
          <div
            className="flex-1 rounded-xl p-3.5 flex items-center gap-3"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--hubb-tint)" }}>
              <svg className="w-4.5 h-4.5" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>30-45 min</p>
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Est. delivery</p>
            </div>
          </div>
          <div
            className="flex-1 rounded-xl p-3.5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold" style={{ color: deliveryFee === 0 ? "var(--hubb-green)" : "var(--text-secondary)" }}>
                {deliveryFee === 0 ? "Free delivery!" : `Rs. ${1000 - Math.round(subtotal)} to free delivery`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-search)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ background: "var(--hubb-accent)", width: `${Math.min(100, (subtotal / 1000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div
          className="rounded-2xl divide-y overflow-hidden"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-sm)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {cart.items.map((ci) => (
            <div key={ci.id} className="p-4 flex items-center gap-4">
              {ci.foodItem.imageURL ? (
                <Image
                  src={ci.foodItem.imageURL}
                  alt={ci.foodItem.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
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
                    className="text-[11px] line-clamp-1 mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {ci.selectedOptions.map((o) => o.name).join(", ")}
                  </p>
                )}
                {ci.specialInstructions && (
                  <p
                    className="text-[11px] italic mt-0.5 line-clamp-1"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    &ldquo;{ci.specialInstructions}&rdquo;
                  </p>
                )}
                <p
                  className="text-sm font-bold mt-1.5"
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
                className="flex items-center rounded-full shrink-0"
                style={{ background: "var(--bg-search)" }}
              >
                <button
                  onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                  aria-label={ci.quantity === 1 ? `Remove ${ci.foodItem.name}` : `Decrease ${ci.foodItem.name} quantity`}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full transition-colors"
                  style={{ color: ci.quantity === 1 ? "var(--hubb-orange)" : "var(--hubb-accent)" }}
                >
                  {ci.quantity === 1 ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : "−"}
                </button>
                <span
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                  aria-live="polite"
                >
                  {ci.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                  aria-label={`Increase ${ci.foodItem.name} quantity`}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full"
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
                color: deliveryFee === 0 ? "var(--hubb-accent)" : "var(--text-primary)",
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
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={{ background: "var(--hubb-tint)", color: "var(--hubb-green)" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free delivery on orders above Rs. 1,000!
            </div>
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
          className="block text-center mt-5 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--hubb-accent)" }}
        >
          Proceed to Checkout • Rs. {Math.round(total)}
        </Link>
      </div>
    </div>
  );
}
