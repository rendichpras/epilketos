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
    <form action={formAction} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <label className="text-sm text-gray-700">Jumlah token</label>
        <input
          name="count"
          type="number"
          min={1}
          max={5000}
          defaultValue={100}
          className="mt-1 w-full rounded-xl border px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="text-sm text-gray-700">Kadaluarsa (opsional)</label>
        <input
          name="expiresAt"
          type="datetime-local"
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-700">
          Catatan batch (opsional)
        </label>
        <input
          name="note"
          placeholder="Gelombang 1 kelas X"
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div className="md:col-span-2">
        <button className="btn-primary h-11 rounded-xl px-5">
          Generate & Download CSV
        </button>
      </div>

      {state && !state.ok && (
        <p className="md:col-span-2 text-sm text-red-600">
          Gagal membuat token. Coba lagi.
        </p>
      )}
      {state?.ok && (
        <p className="md:col-span-2 text-sm text-emerald-700">
          Batch dibuat. Jika unduhan tidak mulai otomatis, klik ulang tombol
          ini.
        </p>
      )}
    </form>
  );
}
