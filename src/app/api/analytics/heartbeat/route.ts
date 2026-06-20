import { NextResponse } from "next/server";
import { createSupabaseClient, hasSupabaseServiceRole } from "@/lib/supabase";

const MAX_PATH_LENGTH = 300;
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

  const now = new Date();
  const staleCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("online_sessions").delete().lt("last_seen", staleCutoff);
  await supabase.from("online_sessions").upsert(
    {
      session_id: sessionId,
      path,
      last_seen: now.toISOString()
    },
    { onConflict: "session_id" }
  );

  return NextResponse.json({ ok: true });
}
