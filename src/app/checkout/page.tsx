"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { useAuth, useAddress } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import * as api from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, itemCount, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { selectedAddress, addresses, selectAddress } = useAddress();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; total: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { showToast } = useToast();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", street: "", city: "" });
  const [addingAddr, setAddingAddr] = useState(false);
  const { refreshAddresses } = useAddress();
  const [tip, setTip] = useState(0);
  const [deliveryNote, setDeliveryNote] = useState("");

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <p className="text-5xl mb-4">🔐</p>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Sign in to checkout
          </h2>
          <Link
            href="/auth"
            className="inline-block mt-4 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (itemCount === 0 && !orderSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Your cart is empty
          </h2>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--hubb-accent)" }}
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center max-w-md mx-4">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-5"
            style={{ background: "var(--hubb-tint)" }}
          >
            ✅
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Order Placed!
          </h2>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Your order has been confirmed. Total: Rs. {Math.round(orderSuccess.total)}
          </p>
          <div className="flex gap-3 mt-6 justify-center">
            <Link
              href={`/tracking/${orderSuccess.id}`}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: "var(--hubb-accent)" }}
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-sm font-semibold"
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = subtotal >= 1000 ? 0 : 99;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + serviceFee + tip - discount;

  async function applyPromo() {
    if (!promoCode.trim()) return;
    setPromoError("");
    try {
      const result = await api.validatePromo(promoCode, subtotal, user?.id);
      setDiscount(result.discount || 0);
    } catch (err: any) {
      setPromoError(err.message || "Invalid promo code");
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) return;
    setPlacing(true);
    try {
      const orderBody = {
        restaurantId: cart.restaurantID,
        items: cart.items.map((ci) => ({
          foodItemId: ci.foodItem.id,
          name: ci.foodItem.name,
          price: ci.foodItem.price,
          quantity: ci.quantity,
          selectedOptions: ci.selectedOptions,
          specialInstructions: ci.specialInstructions,
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        promoCode: promoCode || undefined,
        subtotal,
        deliveryFee,
        serviceFee,
        discount,
        total,
        tip: tip || undefined,
        deliveryNote: deliveryNote.trim() || undefined,
      };
      const order = await api.placeOrder(orderBody);
      setOrderSuccess({ id: order.id || order.orderId, total });
      clearCart();
    } catch (err: any) {
      showToast(err.message || "Failed to place order", "error");
    } finally {
      setPlacing(false);
    }
  }

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
          Checkout
        </h1>

        <div className="space-y-5">
          {/* Estimated Delivery */}
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: "var(--hubb-tint)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in srgb, var(--hubb-accent) 15%, transparent)" }}
            >
              <svg className="w-5 h-5" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--hubb-green)" }}>
                Estimated delivery: 30-45 min
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {itemCount} item{itemCount !== 1 ? "s" : ""} from {cart.restaurantName}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                Delivery Address
              </h2>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-semibold"
                style={{ color: "var(--hubb-accent)" }}
              >
                {showAddAddress ? "Cancel" : "+ Add New"}
              </button>
            </div>
            {showAddAddress && (
              <div className="rounded-xl p-3 mb-3 space-y-2" style={{ background: "var(--bg-search)" }}>
                <input
                  type="text"
                  placeholder="Label (e.g. Home, Office)"
                  value={newAddr.label}
                  onChange={(e) => setNewAddr((p) => ({ ...p, label: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                />
                <input
                  type="text"
                  placeholder="Street address"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr((p) => ({ ...p, street: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
                />
                <button
                  onClick={async () => {
                    if (!newAddr.label.trim() || !newAddr.street.trim() || !newAddr.city.trim()) {
                      showToast("Please fill all address fields", "error");
                      return;
                    }
                    setAddingAddr(true);
                    try {
                      await api.addAddress({ ...newAddr, latitude: 33.6844, longitude: 73.0479 });
                      await refreshAddresses();
                      setNewAddr({ label: "", street: "", city: "" });
                      setShowAddAddress(false);
                      showToast("Address added");
                    } catch (err: any) {
                      showToast(err.message || "Failed to add address", "error");
                    } finally {
                      setAddingAddr(false);
                    }
                  }}
                  disabled={addingAddr}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {addingAddr ? "Adding..." : "Save Address"}
                </button>
              </div>
            )}
            {addresses.length > 0 ? (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background:
                        selectedAddress?.id === addr.id
                          ? "var(--hubb-tint)"
                          : "var(--bg-search)",
                    }}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => selectAddress(addr)}
                      className="accent-[var(--hubb-accent)]"
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {addr.label}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {addr.street}, {addr.city}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : !showAddAddress ? (
              <button
                onClick={() => setShowAddAddress(true)}
                className="w-full py-3 rounded-xl text-sm font-medium text-center"
                style={{ background: "var(--bg-search)", color: "var(--text-secondary)" }}
              >
                Add a delivery address to continue
              </button>
            ) : null}
            {!selectedAddress && addresses.length > 0 && (
              <p className="text-xs mt-2" style={{ color: "var(--hubb-orange)" }}>
                Please select an address
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
              Payment Method
            </h2>
            <div className="space-y-2">
              {[
                { value: "cash", label: "Cash on Delivery", icon: "💵" },
                { value: "jazzcash", label: "JazzCash", icon: "📱" },
                { value: "easypaisa", label: "Easypaisa", icon: "📱" },
                { value: "card", label: "Credit/Debit Card", icon: "💳" },
              ].map((pm) => (
                <label
                  key={pm.value}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                  style={{
                    background:
                      paymentMethod === pm.value
                        ? "var(--hubb-tint)"
                        : "var(--bg-search)",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === pm.value}
                    onChange={() => setPaymentMethod(pm.value)}
                    className="accent-[var(--hubb-accent)]"
                  />
                  <span className="text-lg">{pm.icon}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {pm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
              Promo Code
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "var(--bg-search)",
                  color: "var(--text-primary)",
                  border: "none",
                }}
              />
              <button
                onClick={applyPromo}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--text-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-xs mt-2" style={{ color: "var(--hubb-orange)" }}>
                {promoError}
              </p>
            )}
            {discount > 0 && (
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "var(--hubb-accent)" }}
              >
                Discount applied: Rs. {discount} off!
              </p>
            )}
          </div>

          {/* Delivery Tip */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h2 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
              Tip Your Rider
            </h2>
            <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
              100% of the tip goes to your delivery rider
            </p>
            <div className="flex gap-2">
              {[0, 50, 100, 150, 200].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTip(amount)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: tip === amount ? "var(--hubb-accent)" : "var(--bg-search)",
                    color: tip === amount ? "white" : "var(--text-secondary)",
                  }}
                >
                  {amount === 0 ? "None" : `Rs. ${amount}`}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h2 className="font-bold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
              Delivery Instructions
            </h2>
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Gate code, building directions, leave at door..."
              rows={2}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              style={{
                background: "var(--bg-search)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            <p className="text-[11px] mt-1 text-right" style={{ color: "var(--text-tertiary)" }}>
              {deliveryNote.length}/200
            </p>
          </div>

          {/* Order Summary */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <h2 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
              Order Summary
            </h2>
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              {itemCount} item{itemCount !== 1 ? "s" : ""} from{" "}
              {cart.restaurantName}
            </p>
            {cart.items.map((ci) => (
              <div
                key={ci.id}
                className="flex justify-between text-sm"
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  {ci.quantity}× {ci.foodItem.name}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  Rs. {Math.round(ci.quantity * ci.foodItem.price)}
                </span>
              </div>
            ))}
            <div
              className="pt-3 mt-2 border-t space-y-2"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-primary)" }}>
                  Rs. {Math.round(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
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
              {tip > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Rider Tip</span>
                  <span style={{ color: "var(--text-primary)" }}>Rs. {tip}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--hubb-accent)" }}>Discount</span>
                  <span style={{ color: "var(--hubb-accent)" }}>
                    -Rs. {discount}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between font-bold text-base pt-2 border-t"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                <span>Total</span>
                <span>Rs. {Math.round(total)}</span>
              </div>
            </div>
          </div>

          {/* Place Order */}
          {!selectedAddress && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium"
              style={{ background: "var(--bg-search)", color: "var(--hubb-orange)" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Add a delivery address to place your order
            </div>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={placing || !selectedAddress}
            className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--hubb-accent)" }}
          >
            {placing
              ? "Placing Order..."
              : `Place Order • Rs. ${Math.round(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
