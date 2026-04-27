"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto w-full px-4 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg animate-toast-in flex items-center gap-2.5"
            style={{
              background:
                toast.type === "error"
                  ? "var(--hubb-orange)"
                  : toast.type === "info"
                  ? "var(--hubb-primary)"
                  : "var(--hubb-accent)",
            }}
          >
            {toast.type === "success" && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
