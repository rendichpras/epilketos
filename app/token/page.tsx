"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SubmitTokenButton from "./SubmitTokenButton";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center">
      <div className="container max-w-md mx-auto px-4 py-6 md:py-8">
        <form 
          className="w-full text-center space-y-6"
          autoComplete="off"
          action={verifyToken}
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Masukkan Token
            </h1>
            <p className="text-base text-muted-foreground">
              Masukkan 8 karakter token yang telah diberikan oleh panitia
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Input
              ref={aRef}
              type="text"
              name="tokenA"
              value={a}
              onChange={(e) => handleChangeA(e.target.value)}
              onKeyDown={handleKeyDownA}
              onPaste={handlePaste}
              inputMode="text"
              autoComplete="one-time-code"
              spellCheck={false}
              aria-label="Token bagian pertama"
              className="w-32 text-center text-2xl tracking-[0.35em] py-6"
              placeholder="XXXX"
              required
            />
            <span className="select-none text-xl font-medium text-muted-foreground">
              -
            </span>
            <Input
              ref={bRef}
              type="text"
              name="tokenB"
              value={b}
              onChange={(e) => handleChangeB(e.target.value)}
              onKeyDown={handleKeyDownB}
              onPaste={handlePaste}
              inputMode="text"
              autoComplete="one-time-code"
              spellCheck={false}
              aria-label="Token bagian kedua"
              className="w-32 text-center text-2xl tracking-[0.35em] py-6"
              placeholder="XXXX"
              required
            />
          </div>

          {errorFlag === "invalid" && (
            <Alert variant="destructive">
              <AlertDescription>
                Token tidak valid, sudah digunakan, atau telah kadaluarsa
              </AlertDescription>
            </Alert>
          )}
          {errorFlag === "rate" && (
            <Alert variant="destructive">
              <AlertDescription>
                Terlalu banyak percobaan. Silakan coba lagi dalam beberapa saat
              </AlertDescription>
            </Alert>
          )}

          <div className="sticky bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t">
            <div className="container max-w-5xl mx-auto px-4 py-6">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={resetAll}
                  className="w-full sm:w-auto text-base py-6"
                >
                  Reset
                </Button>
                <SubmitTokenButton disabled={a.length !== 4 || b.length !== 4} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}