"use client";

import { useActionState, useEffect } from "react";
import type { generateTokens as ServerFn } from "./actions";

type ActionReturn = Awaited<ReturnType<typeof ServerFn>>;
type ServerAction = (
  prevState: any,
  formData: FormData
) => Promise<ActionReturn>;

export default function GenerateTokensForm({
  action,
}: {
  action: ServerAction;
}) {
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.ok && state.csv && state.filename) {
      const blob = new Blob([state.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = state.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, [state]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Jumlah token
        </label>
        <input
          name="count"
          type="number"
          min={1}
          max={5000}
          defaultValue={100}
          className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Kadaluarsa (opsional)
        </label>
        <input
          name="expiresAt"
          type="datetime-local"
          className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Catatan batch (opsional)
        </label>
        <input
          name="note"
          placeholder="Gelombang 1 kelas X"
          className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="md:col-span-2">
        <button 
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full md:w-auto"
        >
          Generate & Download CSV
        </button>
      </div>

      {state && !state.ok && (
        <div className="md:col-span-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          Gagal membuat token. Coba lagi.
        </div>
      )}
      {state?.ok && (
        <div className="md:col-span-2 rounded-lg border border-green-600/20 bg-green-50 p-4 text-sm text-green-600">
          Batch dibuat. Jika unduhan tidak mulai otomatis, klik ulang tombol ini.
        </div>
      )}
    </form>
  );
}
