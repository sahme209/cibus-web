"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store";

interface Notification {
  id: string;
  type: "promo" | "order" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "promo",
    title: "50% off your next order!",
    message: "Use code HUBB50 at checkout. Valid until tomorrow.",
    time: "2h ago",
    read: false,
    actionUrl: "/search",
  },
  {
    id: "2",
    type: "system",
    title: "Welcome to HUBB!",
    message: "Your account is all set up. Start exploring restaurants near you.",
    time: "1d ago",
    read: true,
    actionUrl: "/",
  },
  {
    id: "3",
    type: "promo",
    title: "Free delivery this weekend",
    message: "Enjoy Rs. 0 delivery on all orders above Rs. 500. No code needed.",
    time: "2d ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Try HUBB+ for free",
    message: "Get unlimited free delivery, 5% cashback, and exclusive deals. First month on us.",
    time: "3d ago",
    read: true,
    actionUrl: "/hubb-plus",
  },
];

const TYPE_CONFIG = {
  promo: {
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    color: "var(--hubb-accent)",
    bg: "var(--hubb-tint)",
  },
  order: {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    color: "var(--status-placed)",
    bg: "var(--status-placed-bg)",
  },
  system: {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "var(--text-secondary)",
    bg: "var(--bg-search)",
  },
};

export default function NotificationsPage() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Sign in to view notifications
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Stay updated on your orders and deals
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--hubb-accent)" }}
            >
              Mark all read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-2 stagger-children">
            {notifications.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type];
              const Wrapper = notif.actionUrl ? Link : "div";
              const wrapperProps = notif.actionUrl ? { href: notif.actionUrl } : {};

              return (
                <Wrapper
                  key={notif.id}
                  {...(wrapperProps as any)}
                  className={`flex items-start gap-3 p-4 rounded-2xl transition-all ${notif.actionUrl ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer" : ""}`}
                  style={{
                    background: notif.read ? "var(--bg-card)" : "var(--hubb-tint-soft)",
                    boxShadow: "var(--shadow-sm)",
                    border: notif.read ? "none" : "1px solid var(--hubb-tint)",
                  }}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                    );
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <svg className="w-5 h-5" style={{ color: cfg.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cfg.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--hubb-accent)" }} />
                      )}
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {notif.message}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {notif.time}
                    </p>
                  </div>
                  {notif.actionUrl && (
                    <svg className="w-4 h-4 shrink-0 mt-3" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Wrapper>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-up">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style={{ background: "var(--bg-search)" }}>
              <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              All caught up!
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              No new notifications right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
