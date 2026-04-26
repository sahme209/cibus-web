"use client";

import { useCart } from "@/lib/store";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, subtotal, itemCount, removeItem, updateQuantity } = useCart();

  const deliveryFee = subtotal >= 1000 ? 0 : 99;
  const total = subtotal + deliveryFee + Math.round(subtotal * 0.05);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md transition-transform duration-300 ease-out flex flex-col"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          background: "var(--bg-primary)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Your Cart
            </h2>
            {cart.restaurantName && (
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {cart.restaurantName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--bg-search)" }}
          >
            <svg className="w-5 h-5" style={{ color: "var(--text-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "var(--bg-search)" }}>
                <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Your cart is empty
              </p>
              <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
                Add items from a restaurant to get started
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {cart.items.map((ci) => (
                <div key={ci.id} className="px-5 py-4 flex gap-3">
                  {ci.foodItem.imageURL ? (
                    <img
                      src={ci.foodItem.imageURL}
                      alt={ci.foodItem.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: "var(--bg-search)" }}
                    >
                      <span className="text-lg">🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold line-clamp-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {ci.foodItem.name}
                    </h4>
                    {ci.selectedOptions.length > 0 && (
                      <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "var(--text-tertiary)" }}>
                        {ci.selectedOptions.map((o) => o.name).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        Rs. {Math.round(ci.quantity * (ci.foodItem.price + ci.selectedOptions.reduce((s, o) => s + o.additionalCost, 0)))}
                      </span>
                      <div
                        className="flex items-center rounded-full"
                        style={{ background: "var(--bg-search)" }}
                      >
                        <button
                          onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded-full"
                          style={{ color: "var(--hubb-accent)" }}
                        >
                          {ci.quantity === 1 ? (
                            <svg className="w-3.5 h-3.5" style={{ color: "var(--hubb-orange)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          ) : "−"}
                        </button>
                        <span
                          className="w-6 text-center text-sm font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded-full"
                          style={{ color: "var(--hubb-accent)" }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {itemCount > 0 && (
          <div
            className="px-5 py-4 border-t space-y-3"
            style={{ borderColor: "var(--border-default)" }}
          >
            {deliveryFee === 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                style={{ background: "var(--hubb-tint)", color: "var(--hubb-green)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free delivery on this order!
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>Rs. {Math.round(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block text-center py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "var(--hubb-accent)" }}
            >
              Checkout • Rs. {Math.round(total)}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
