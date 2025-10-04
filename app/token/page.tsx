"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "./actions";
import { useFormStatus } from "react-dom";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full sm:w-auto text-base py-6"
    >
      {pending ? "Memverifikasi…" : "Verifikasi Token"}
    </button>
  );
}

const AMBIGUOUS_MAP: Record<string, string> = {
  i: "1",
  I: "1",
  l: "1",
  L: "1",
  o: "0",
  O: "0",
  u: "V",
  U: "V",
};

function sanitizeChunk(value: string) {
  const up = value
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .split("")
    .map((ch) => AMBIGUOUS_MAP[ch] ?? ch)
    .filter((ch) => ALPHABET.includes(ch))
    .join("");
  return up.slice(0, 4);
}

export default function TokenPage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const aRef = useRef<HTMLInputElement>(null);
  const bRef = useRef<HTMLInputElement>(null);
  const search = useSearchParams();
  const errorFlag = search.get("e");

  useEffect(() => {
    aRef.current?.focus();
  }, []);

  function handleChangeA(v: string) {
    const s = sanitizeChunk(v);
    setA(s);
    if (s.length === 4) bRef.current?.focus();
  }
  function handleChangeB(v: string) {
    const s = sanitizeChunk(v);
    setB(s);
  }
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    e.preventDefault();
    const mapped = text
      .toUpperCase()
      .replace(/[^0-9A-Z]/g, "")
      .split("")
      .map((ch) => AMBIGUOUS_MAP[ch] ?? ch)
      .filter((ch) => ALPHABET.includes(ch))
      .join("")
      .slice(0, 8);

    if (mapped.length <= 4) {
      setA(mapped);
      setB("");
      (mapped.length === 4 ? bRef : aRef).current?.focus();
    } else {
      setA(mapped.slice(0, 4));
      setB(mapped.slice(4, 8));
      bRef.current?.focus();
    }
  }
  function handleKeyDownA(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowRight" && a.length === 4) bRef.current?.focus();
  }
  function handleKeyDownB(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowLeft" && (bRef.current?.selectionStart ?? 0) === 0)
      aRef.current?.focus();
    if (e.key === "Backspace" && b.length === 0) aRef.current?.focus();
  }
  function resetAll() {
    setA("");
    setB("");
    aRef.current?.focus();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <form 
          className="flex flex-col gap-8"
          autoComplete="off"
          action={verifyToken}
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3 text-primary">
              Verifikasi Token
            </h1>
            <p className="text-muted-foreground">
              Masukkan token 8 karakter yang telah diberikan oleh panitia
            </p>
          </div>

          {/* Token Input */}
          <div className="bg-card border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <input
                ref={aRef}
                type="text"
                name="tokenA"
                value={a}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeA(e.target.value)}
                onKeyDown={handleKeyDownA}
                onPaste={handlePaste}
                inputMode="text"
                autoComplete="one-time-code"
                spellCheck={false}
                aria-label="Token bagian pertama"
                className="w-32 h-16 text-center text-2xl tracking-[0.35em] rounded-lg border bg-background/50 hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="XXXX"
                required
              />
              <div className="w-4 h-0.5 bg-border rounded-full" />
              <input
                ref={bRef}
                type="text"
                name="tokenB"
                value={b}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeB(e.target.value)}
                onKeyDown={handleKeyDownB}
                onPaste={handlePaste}
                inputMode="text"
                autoComplete="one-time-code"
                spellCheck={false}
                aria-label="Token bagian kedua"
                className="w-32 h-16 text-center text-2xl tracking-[0.35em] rounded-lg border bg-background/50 hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="XXXX"
                required
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Token bersifat case-insensitive dan mengabaikan karakter khusus</p>
            </div>
          </div>

          {/* Error Messages */}
          {errorFlag === "invalid" && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive animate-in fade-in-50">
              Token tidak valid, sudah digunakan, atau telah kadaluarsa
            </div>
          )}
          {errorFlag === "rate" && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive animate-in fade-in-50">
              Terlalu banyak percobaan. Silakan coba lagi dalam beberapa saat
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="w-full sm:w-auto h-12 px-6 rounded-lg border bg-card hover:bg-accent text-base"
            >
              Reset
            </button>
            <SubmitButton 
              disabled={a.length !== 4 || b.length !== 4}
            />
          </div>
        </form>
      </div>
    </div>
  );
}