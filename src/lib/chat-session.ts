import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const CHAT_SESSION_COOKIE = "portfolio_chat_session";

const SESSION_PATTERN = /^[a-zA-Z0-9._:-]{8,128}$/;

export async function getChatSession(): Promise<{ sessionId: string; isNew: boolean }> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CHAT_SESSION_COOKIE)?.value?.trim() ?? "";
  if (SESSION_PATTERN.test(existing)) {
    return { sessionId: existing, isNew: false };
  }

  return { sessionId: crypto.randomUUID(), isNew: true };
}

export function setChatSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set({
    name: CHAT_SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

