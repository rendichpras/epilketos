"use client";

import { useActionState } from "react";
import { doLogin } from "./actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [state, formAction] = useActionState(doLogin, null);
  const sp = useSearchParams();
  const next = sp.get("redirect") ?? "/admin";

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Masuk Admin</h1>
        <p className="text-muted-foreground text-sm">
          Masuk ke dashboard administrator
        </p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {state?.error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive animate-in fade-in-50">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            className="w-full h-11 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}