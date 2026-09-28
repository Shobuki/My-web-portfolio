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

  const upstreamUrl = new URL(`${baseUrl}/webchat/history`);
  upstreamUrl.searchParams.set("sessionId", sessionId);

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
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

