import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const rlPage = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "rl:page",
});

export default auth(async (req) => {
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth?.user) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("redirect", nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  if (nextUrl.pathname.startsWith("/token")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ua = req.headers.get("user-agent") || "";
    const id = `${ip}:${ua.slice(0, 64)}`;
    const { success } = await rlPage.limit(id);
    if (!success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/token"],
};
