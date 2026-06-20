import { NextResponse } from "next/server";
import { createSupabaseClient, hasSupabaseServiceRole } from "@/lib/supabase";

const MAX_PATH_LENGTH = 300;
const MAX_REFERRER_LENGTH = 500;
const MAX_USER_AGENT_LENGTH = 300;
const MAX_SESSION_LENGTH = 80;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function cleanPath(value: unknown) {
  const path = cleanText(value, MAX_PATH_LENGTH);
  if (!path || !path.startsWith("/") || path.includes("://")) return null;
  return path;
}

export async function POST(request: Request) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json({ ok: true });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const path = cleanPath(body?.path);
  const sessionId = cleanText(body?.sessionId, MAX_SESSION_LENGTH);
  if (!path || !sessionId) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const userAgent = cleanText(request.headers.get("user-agent"), MAX_USER_AGENT_LENGTH);
  const referrer = cleanText(body?.referrer, MAX_REFERRER_LENGTH);
  const now = new Date().toISOString();

  await supabase.from("page_views").insert({
    path,
    referrer,
    user_agent: userAgent,
    session_id: sessionId,
    created_at: now
  });

  await supabase.from("online_sessions").upsert(
    {
      session_id: sessionId,
      path,
      last_seen: now
    },
    { onConflict: "session_id" }
  );

  return NextResponse.json({ ok: true });
}
