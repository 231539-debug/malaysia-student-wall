import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "msw_admin";

function adminToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  return createHash("sha256").update(`malaysia-student-wall:${password}`).digest("hex");
}

export async function isAdminAuthenticated() {
  const expected = adminToken();
  const cookieStore = await cookies();
  const actual = cookieStore.get(COOKIE_NAME)?.value;

  if (!expected || !actual || expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export async function setAdminCookie() {
  const token = adminToken();
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return true;
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
