"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "msw-site-session-id";

function getSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const nextId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, nextId);
    return nextId;
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function postAnalytics(endpoint: string, payload: Record<string, string | null>) {
  fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {
    // Analytics should never affect the user experience.
  });
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const path = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    const sessionId = getSessionId();
    postAnalytics("/api/analytics/pageview", {
      path,
      referrer: document.referrer || null,
      sessionId
    });
  }, [path]);

  useEffect(() => {
    const sessionId = getSessionId();
    const sendHeartbeat = () => {
      postAnalytics("/api/analytics/heartbeat", { path, sessionId });
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 30_000);
    return () => window.clearInterval(interval);
  }, [path]);

  return null;
}
