import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();

export async function rateLimit(
  keySalt: string,
  limit = 10,
  windowMs = 60_000
) {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";
  const key = `${keySalt}:${ip}`;

  const now = Date.now();
  const win = store.get(key);
  if (!win || now > win.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (win.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(0, win.resetAt - now),
    };
  }

  win.count += 1;
  return { ok: true, remaining: limit - win.count };
}

export const rlVerify = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "rl:verify",
});

export const rlCast = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, "30 s"),
  analytics: true,
  prefix: "rl:cast",
});
