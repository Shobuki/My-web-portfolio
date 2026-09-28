import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const baseUrl = process.env.FORJA_WEBCHAT_URL?.replace(/\/$/, "");
  const token = process.env.FORJA_WEBCHAT_TOKEN;

  if (!baseUrl || !token) {
    return NextResponse.json({ error: "Chat is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const input = body as { sessionId?: unknown; message?: unknown };
  const sessionId = typeof input.sessionId === "string" ? input.sessionId.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!sessionId || !message || message.length > 4000) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  try {
    const response = await fetch(`${baseUrl}/webchat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, message }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json().catch(() => ({ error: "Invalid response from chat service." }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Chat service is unavailable." }, { status: 502 });
  }
}
