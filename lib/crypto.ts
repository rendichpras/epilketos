import crypto from "node:crypto";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function normalizeToken(raw: string) {
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

export function isValidToken8(tok: string) {
  if (tok.length !== 8) return false;
  for (const ch of tok) if (!ALPHABET.includes(ch)) return false;
  return true;
}

export function hashToken(token: string) {
  const pepper = process.env.TOKEN_PEPPER ?? "";
  const h = crypto.createHmac("sha256", pepper);
  h.update(token);
  return h.digest("hex");
}

export function sign(payload: string) {
  const secret = process.env.COOKIE_SECRET ?? "";
  const mac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${mac}`;
}

export function verify(signed: string) {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = signed.slice(0, idx);
  const mac = signed.slice(idx + 1);
  const secret = process.env.COOKIE_SECRET ?? "";
  const expect = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expect))
    ? payload
    : null;
}
