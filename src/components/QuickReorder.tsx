"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/store";
import * as api from "@/lib/api";

interface PastOrder {
  id: string;
  restaurantID: string;
  restaurantName: string;
  restaurantImageURL: string;
  total: number;
  items: { foodItem: { name: string; restaurantID: string } }[];
}

export default function QuickReorder() {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<PastOrder[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;
    api
      .getOrderHistory(1, 10)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.orders || [];
        const delivered = list
          .filter((o: any) => o.status === "delivered")
          .slice(0, 6);
        setOrders(delivered);
      })
      .catch(() => {});
  }, [isLoggedIn]);

  if (orders.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Order Again
        </h2>
        <Link
          href="/orders"
          className="text-sm font-semibold"
          style={{ color: "var(--hubb-accent)" }}
        >
          View All →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/restaurant/${order.restaurantID || order.items[0]?.foodItem?.restaurantID || order.id}`}
            className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-sm)",
              minWidth: 220,
            }}
          >
            {order.restaurantImageURL ? (
              <Image
                src={order.restaurantImageURL}
                alt={order.restaurantName}
                width={48}
                height={48}
                className="rounded-lg object-cover shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                style={{ background: "var(--bg-search)" }}
              >
                <span className="text-lg">🍽️</span>
              </div>
            )}
            <div className="min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {order.restaurantName}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-tertiary)" }}
              >
                {order.items
                  .slice(0, 2)
                  .map((i) => i.foodItem.name)
                  .join(", ")}
              </p>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: "var(--hubb-accent)" }}
              >
                Rs. {Math.round(order.total)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
