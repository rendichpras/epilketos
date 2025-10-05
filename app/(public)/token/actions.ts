"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken, isValidToken8, normalizeToken, sign } from "@/lib/crypto";
import { rlVerify } from "@/lib/rateLimit";

function identityFromHeaders(h: Headers) {
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const ua = h.get("user-agent") || "";
  return `${ip}:${ua.slice(0, 64)}`;
}

export async function verifyToken(formData: FormData) {
  const h = await headers();
  const id = identityFromHeaders(h);
  const { success } = await rlVerify.limit(id);
  if (!success) {
    redirect("/token?e=rate");
  }

  const a = String(formData.get("tokenA") ?? "");
  const b = String(formData.get("tokenB") ?? "");
  const joined = normalizeToken(a + b);
  if (!isValidToken8(joined)) {
    redirect("/token?e=invalid");
  }

  const tokenHash = hashToken(joined);
  const token = await prisma.token.findUnique({ where: { tokenHash } });
  const now = new Date();
  if (
    !token ||
    token.status !== "unused" ||
    (token.expiresAt && token.expiresAt <= now)
  ) {
    redirect("/token?e=invalid");
  }

  const jar = await cookies();
  const payload = JSON.stringify({ th: tokenHash, ts: Date.now() });
  jar.set({
    name: "ballot",
    value: sign(payload),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  redirect("/ballot");
}
