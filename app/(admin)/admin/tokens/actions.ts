"use server";

import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function normalizeToken(raw: string) {
  const map: Record<string, string> = {
    I: "1",
    i: "1",
    L: "1",
    l: "1",
    O: "0",
    o: "0",
    U: "V",
    u: "V",
  };
  return raw
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");
}

function randomToken8() {
  const bytes = crypto.randomBytes(8);
  let out = "";
  for (let i = 0; i < 8; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out.slice(0, 4) + "-" + out.slice(4, 8);
}

function hashToken(tokenPlain: string) {
  const pepper = process.env.TOKEN_PEPPER ?? "";
  const h = crypto.createHmac("sha256", pepper);
  h.update(tokenPlain);
  return h.digest("hex");
}

export async function generateTokens(formData: FormData) {
  "use server";

  const count = Math.min(Math.max(Number(formData.get("count") ?? 0), 1), 5000);
  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim() || null;

  const expiresAt = expiresRaw ? new Date(expiresRaw) : null;
  const set = new Set<string>();
  while (set.size < count) set.add(randomToken8());
  const tokensPlain = Array.from(set);
  const now = new Date();

  const batch = await prisma.$transaction(async (tx) => {
    const b = await tx.tokenBatch.create({
      data: {
        count,
        expiresAt: expiresAt ?? undefined,
        note: note ?? undefined,
      },
    });

    const rows = tokensPlain.map((t) => {
      const normalized = normalizeToken(t);
      return {
        tokenHash: hashToken(normalized),
        status: "unused" as const,
        expiresAt: expiresAt ?? null,
        batchId: b.id,
        createdAt: now,
        updatedAt: now,
      };
    });

    await tx.token.createMany({ data: rows, skipDuplicates: true });
    return b;
  });

  const header = "token,expires_at\n";
  const csv =
    header +
    tokensPlain
      .map((t) => {
        const ex = expiresAt ? expiresAt.toISOString() : "";
        return `${t},${ex}`;
      })
      .join("\n") +
    "\n";

  revalidatePath("/admin/tokens");

  return {
    ok: true,
    filename: `tokens-${batch.id}.csv`,
    csv,
  };
}