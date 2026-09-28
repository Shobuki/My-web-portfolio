import { NextResponse } from "next/server";
import { getChatSession, setChatSessionCookie } from "@/lib/chat-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function GET(request: Request) {
  const { sessionId, isNew } = await getChatSession();
  const baseUrl = process.env.FORJA_WEBCHAT_URL?.replace(/\/$/, "");
  const token = process.env.FORJA_WEBCHAT_TOKEN;
  const url = new URL(request.url);
  const after = url.searchParams.get("after")?.trim() ?? "0";

  if (!baseUrl || !token || !/^\d+(\.\d+)?$/.test(after)) {
    const response = NextResponse.json({ error: "Chat stream is not configured." }, { status: 503 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  const upstreamUrl = new URL(`${baseUrl}/webchat/messages`);
  upstreamUrl.searchParams.set("sessionId", sessionId);
  upstreamUrl.searchParams.set("after", after);

  let stopped = false;
  let cursor = Number(after);
  let closeStream = () => {};
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const close = () => {
        if (stopped) return;
        stopped = true;
        controller.close();
      };
      closeStream = close;

      const write = (value: string) => {
        if (!stopped) controller.enqueue(encoder.encode(value));
      };

      write(": connected\n\n");

      const poll = async () => {
        while (!stopped) {
          try {
            const pollUrl = new URL(upstreamUrl);
            pollUrl.searchParams.set("after", String(cursor));
            const upstream = await fetch(pollUrl, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
              signal: AbortSignal.timeout(2500),
            });
            if (upstream.ok) {
              const data = (await upstream.json().catch(() => null)) as { messages?: unknown } | null;
              if (data && Array.isArray(data.messages) && data.messages.length > 0) {
                for (const message of data.messages) {
                  if (
                    message &&
                    typeof message === "object" &&
                    "created_at" in message &&
                    typeof message.created_at === "number"
                  ) {
                    cursor = Math.max(cursor, message.created_at);
                  }
                }
                write(`data: ${JSON.stringify({ messages: data.messages })}\n\n`);
              } else {
                write(": keep-alive\n\n");
              }
            }
          } catch {
            write(": upstream-unavailable\n\n");
          }
          if (!stopped) await wait(1000);
        }
      };

      void poll();
      setTimeout(close, 8000);
    },
    cancel() {
      closeStream();
    },
  });

  const response = new NextResponse(stream, {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
  if (isNew) setChatSessionCookie(response, sessionId);
  return response;
}
