"use client";

import { useState } from "react";

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "Hi! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user" as const, text: trimmed }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot" as const,
          text: "Thanks for reaching out! A support agent will be with you shortly. In the meantime, check our Help Center for quick answers.",
        },
      ]);
    }, 1200);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 sm:bottom-6 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{
          background: "var(--hubb-accent)",
          boxShadow: "0 4px 20px rgba(0,112,74,0.4)",
        }}
        aria-label={open ? "Close chat" : "Open live chat"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-36 sm:bottom-24 right-4 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden animate-fade-up flex flex-col"
          style={{
            background: "var(--bg-card)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
            border: "1px solid var(--border-default)",
            maxHeight: "420px",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ background: "var(--hubb-accent)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">HUBB Support</p>
              <p className="text-[10px] text-white/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                Online now
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: "200px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background:
                      msg.from === "user"
                        ? "var(--hubb-accent)"
                        : "var(--bg-search)",
                    color: msg.from === "user" ? "white" : "var(--text-primary)",
                    borderBottomRightRadius:
                      msg.from === "user" ? "4px" : undefined,
                    borderBottomLeftRadius:
                      msg.from === "bot" ? "4px" : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            className="px-3 py-3 flex items-center gap-2 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Type a message..."
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm"
              style={{
                background: "var(--bg-search)",
                color: "var(--text-primary)",
                border: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-all hover:scale-105"
              style={{ background: "var(--hubb-accent)" }}
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
