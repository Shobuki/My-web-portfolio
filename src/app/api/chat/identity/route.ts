import { NextResponse } from "next/server";
import { getChatSession, setChatSessionCookie } from "@/lib/chat-session";

export const runtime = "nodejs";

export async function GET() {
  const { sessionId, isNew } = await getChatSession();
  const baseUrl = process.env.FORJA_WEBCHAT_URL?.replace(/\/$/, "");
  const token = process.env.FORJA_WEBCHAT_TOKEN;

  if (!baseUrl || !token) {
    const response = NextResponse.json({ error: "Chat is not configured." }, { status: 503 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  const upstreamUrl = new URL(`${baseUrl}/webchat/identity`);
  upstreamUrl.searchParams.set("sessionId", sessionId);

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const data = await upstream.json().catch(() => ({ error: "Invalid response from chat service." }));
    const response = NextResponse.json(data, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  } catch {
    const response = NextResponse.json({ error: "Chat service is unavailable." }, { status: 502 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }
}

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

  const input = body as { displayName?: unknown };
  const displayName = typeof input.displayName === "string"
    ? input.displayName.trim().replace(/\s+/g, " ").slice(0, 120)
    : "";
  if (displayName.length < 2) {
    const response = NextResponse.json({ error: "A valid name is required." }, { status: 400 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  try {
    const upstream = await fetch(`${baseUrl}/webchat/identity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, displayName }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await upstream.json().catch(() => ({ error: "Invalid response from chat service." }));
    const response = NextResponse.json(data, { status: upstream.status });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  } catch {
    const response = NextResponse.json({ error: "Chat service is unavailable." }, { status: 502 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }
}
