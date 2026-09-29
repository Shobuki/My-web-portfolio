import { NextResponse } from "next/server";
import { getChatSession, setChatSessionCookie } from "@/lib/chat-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { sessionId, isNew } = await getChatSession();
  const baseUrl = process.env.FORJA_WEBCHAT_URL?.replace(/\/$/, "");
  const token = process.env.FORJA_WEBCHAT_TOKEN;

  if (!baseUrl || !token) {
    const response = NextResponse.json({ error: "Chat is not configured." }, { status: 503 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const input = body as { message?: unknown; displayName?: unknown };
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const displayName = typeof input.displayName === "string"
    ? input.displayName.trim().replace(/\s+/g, " ").slice(0, 120)
    : "";

  if (!message || message.length > 4000 || displayName.length < 2) {
    const response = NextResponse.json({ error: "A valid name and message are required." }, { status: 400 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  try {
    const response = await fetch(`${baseUrl}/webchat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, message, displayName }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json().catch(() => ({ error: "Invalid response from chat service." }));
    const result = NextResponse.json(data, { status: response.status });
    if (isNew) setChatSessionCookie(result, sessionId);
    return result;
  } catch {
    const response = NextResponse.json({ error: "Chat service is unavailable." }, { status: 502 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }
}
