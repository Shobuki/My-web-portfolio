import { NextResponse } from "next/server";
import { getChatSession, setChatSessionCookie } from "@/lib/chat-session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { sessionId, isNew } = await getChatSession();
  const baseUrl = process.env.FORJA_WEBCHAT_URL?.replace(/\/$/, "");
  const token = process.env.FORJA_WEBCHAT_TOKEN;
  const url = new URL(request.url);
  const after = url.searchParams.get("after")?.trim() ?? "0";

  if (!baseUrl || !token) {
    const response = NextResponse.json({ error: "Chat is not configured." }, { status: 503 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  if (!/^\d+(\.\d+)?$/.test(after)) {
    const response = NextResponse.json({ error: "Invalid chat cursor." }, { status: 400 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }

  const upstreamUrl = new URL(`${baseUrl}/webchat/messages`);
  upstreamUrl.searchParams.set("sessionId", sessionId);
  upstreamUrl.searchParams.set("after", after);

  try {
    const response = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json().catch(() => ({ error: "Invalid response from chat service." }));
    const result = NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
    if (isNew) setChatSessionCookie(result, sessionId);
    return result;
  } catch {
    const response = NextResponse.json({ error: "Chat service is unavailable." }, { status: 502 });
    if (isNew) setChatSessionCookie(response, sessionId);
    return response;
  }
}
