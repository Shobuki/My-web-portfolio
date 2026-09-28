'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "owner";
  text: string;
  createdAt?: number;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! Ask me about Alfredo's projects, skills, experience, or how we can work together.",
};

type PersistedMessage = {
  id?: unknown;
  role?: unknown;
  content?: unknown;
  created_at?: unknown;
};

function toChatMessage(message: PersistedMessage): ChatMessage | null {
  if (
    typeof message.id !== "string" ||
    typeof message.content !== "string" ||
    !["user", "assistant", "owner"].includes(String(message.role))
  ) {
    return null;
  }

  return {
    id: message.id,
    role: message.role as ChatMessage["role"],
    text: message.content,
    createdAt: typeof message.created_at === "number" ? message.created_at : undefined,
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [botOnline, setBotOnline] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const endRef = useRef<HTMLDivElement>(null);
  const historyLoadedRef = useRef(false);
  const ownerCursorRef = useRef(0);
  const seenMessageIdsRef = useRef(new Set<string>());
  const stopStreamRef = useRef<null | (() => void)>(null);

  const loadHistory = useCallback(async () => {
    if (historyLoadedRef.current) return;

    try {
      const response = await fetch("/api/chat/history", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data || !Array.isArray(data.messages)) return;

      const saved = (data.messages as PersistedMessage[])
        .map(toChatMessage)
        .filter((message): message is ChatMessage => message !== null);

      for (const message of saved) {
        seenMessageIdsRef.current.add(message.id);
        if (message.role === "owner" && typeof message.createdAt === "number") {
          ownerCursorRef.current = Math.max(ownerCursorRef.current, message.createdAt);
        }
      }

      setMessages(saved.length > 0 ? saved : [WELCOME_MESSAGE]);
      setBotOnline(typeof data.botOnline === "boolean" ? data.botOnline : data.paused !== true);
      historyLoadedRef.current = true;
    } catch {
      // The chat can still start a new conversation if history is unavailable.
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/status", { cache: "no-store" });
      const data = await response.json().catch(() => null);
      if (response.ok && data && typeof data.botOnline === "boolean") {
        setBotOnline(data.botOnline);
      }
    } catch {
      // Keep the last known mode while the status endpoint reconnects.
    }
  }, []);

  const connectRealtime = useCallback(() => {
    let stopped = false;
    let reconnectTimer: number | undefined;
    let source: EventSource | null = null;

    const connect = () => {
      if (stopped) return;

      const params = new URLSearchParams({ after: String(ownerCursorRef.current) });
      source = new EventSource(`/api/chat/stream?${params.toString()}`);

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { messages?: PersistedMessage[] };
          const incoming = Array.isArray(data.messages) ? data.messages : [];
          const nextMessages: ChatMessage[] = [];

          for (const rawMessage of incoming) {
            const message = toChatMessage(rawMessage);
            if (!message || message.role !== "owner" || seenMessageIdsRef.current.has(message.id)) {
              continue;
            }
            seenMessageIdsRef.current.add(message.id);
            if (typeof message.createdAt === "number") {
              ownerCursorRef.current = Math.max(ownerCursorRef.current, message.createdAt);
            }
            nextMessages.push(message);
          }

          if (nextMessages.length > 0) {
            setMessages((current) => [...current, ...nextMessages]);
          }
        } catch {
          // Ignore malformed events and let the stream reconnect.
        }
      };

      source.onerror = () => {
        source?.close();
        source = null;
        if (!stopped) {
          reconnectTimer = window.setTimeout(connect, 500);
        }
      };
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      source?.close();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void loadHistory().then(() => {
      if (!cancelled) stopStreamRef.current = connectRealtime();
    });
    void refreshStatus();
    const statusTimer = window.setInterval(() => {
      void refreshStatus();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(statusTimer);
      stopStreamRef.current?.();
      stopStreamRef.current = null;
    };
  }, [open, loadHistory, connectRealtime, refreshStatus]);

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
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.text !== "string") {
        throw new Error("Chat request failed");
      }
      if (data.paused === true) {
        setBotOnline(false);
        return;
      }
      setBotOnline(true);
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
              <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    botOnline === false ? "bg-amber-400" : botOnline === true ? "bg-emerald-400" : "bg-white/40"
                  }`}
                />
                {botOnline === false ? "Human direct" : botOnline === true ? "Bot online" : "Checking status..."}
              </p>
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
            {botOnline === false && (
              <div className="rounded-xl border border-primary-red/40 bg-primary-red/10 px-3 py-2 text-xs leading-relaxed text-text-secondary">
                Human direct is active. Your messages are saved, but the bot will stay silent until it is resumed from Forja.
              </div>
            )}
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
                  {message.role === "owner" && (
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-primary-red">
                      Alfredo
                    </span>
                  )}
                  {message.text}
                </div>
              </div>
            ))}
            {sending && <p className="text-xs text-text-secondary">Thinking...</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-outline-variant p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={botOnline === false ? "Message the human owner..." : "Type a message..."}
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
