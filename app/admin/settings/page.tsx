import { prisma } from "@/lib/prisma";
import { openElection, closeElection } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const e = await prisma.election.findFirst({ orderBy: { id: "asc" } });
  const status = e?.isOpen ? "DIBUKA" : "DITUTUP";
  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Status Pemilu: {status}</h2>
        {e && (
          <p className="mt-1 text-gray-600">
            {e.name} · {new Date(e.startAt).toLocaleString()} →{" "}
            {new Date(e.endAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="text-base font-semibold">Buka Pemilu</h3>
        <form
          action={openElection}
          className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <div>
            <label className="text-sm text-gray-700">Nama</label>
            <input
              name="name"
              defaultValue={e?.name ?? "Pemilu OSIS"}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Durasi (jam)</label>
            <input
              name="durationH"
              type="number"
              min={1}
              defaultValue={8}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary rounded-xl px-5 py-2">
              Buka Pemilu
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold">Tutup Pemilu</h3>
        <form action={closeElection} className="mt-3">
          <button className="rounded-xl border px-4 py-2 text-red-600 hover:bg-red-50">
            Tutup Sekarang
          </button>
        </form>
      </div>

      <Link href="/admin" className="text-sm text-gray-600 hover:underline">
        ← Kembali ke Dashboard
      </Link>
    </main>
  );
}
