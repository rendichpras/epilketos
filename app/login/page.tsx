"use client";

import { useActionState } from "react";
import { doLogin } from "./actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [state, formAction] = useActionState(doLogin, null);
  const sp = useSearchParams();
  const next = sp.get("redirect") ?? "/admin";

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-3 text-primary">Masuk Admin</h1>
            <p className="text-muted-foreground">Masuk ke dashboard administrator</p>
          </div>
          {/* Login Form */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
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
                className="w-full h-11 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
