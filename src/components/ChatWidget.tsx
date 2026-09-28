'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const SESSION_KEY = "portfolio-chat-session";

function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, id);
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! Ask me about Alfredo's projects, skills, experience, or how we can work together.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text },
    ]);
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId(), message: text }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.text !== "string") {
        throw new Error("Chat request failed");
      }
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: "assistant", text: data.text },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "Sorry, the chat is temporarily unavailable. Please use the contact section below.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[min(70vh,520px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-[#211516] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
            <div>
              <p className="font-semibold text-text-primary">Chat with Alfredo&apos;s AI</p>
              <p className="text-xs text-text-secondary">Ask anything about the portfolio</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-2 text-text-secondary transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary-red text-white"
                      : "rounded-bl-md bg-white/10 text-text-primary"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {sending && <p className="text-xs text-text-secondary">Thinking…</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-outline-variant p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type a message..."
              maxLength={4000}
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-text-secondary focus:border-primary-red"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label="Send message"
              className="rounded-xl bg-primary-red p-2.5 text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-red text-white shadow-lg shadow-red-950/40 transition hover:scale-105 hover:bg-red-400"
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
