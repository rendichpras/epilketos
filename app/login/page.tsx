"use client";

import { useActionState } from "react";
import { doLogin } from "./actions";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [state, formAction] = useActionState(doLogin, null);
  const sp = useSearchParams();
  const next = sp.get("redirect") ?? "/admin";

  return (
    <main className="mx-auto max-w-sm">
      <div className="card">
        <h2 className="text-xl font-semibold">Masuk Admin</h2>
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
            />
          </div>
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <button className="btn-primary h-11 w-full rounded-xl px-5">
            Masuk
          </button>
        </form>
      </div>
    </main>
  );
}
