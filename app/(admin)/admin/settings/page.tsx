import { prisma } from "@/lib/prisma";
import { openElection, closeElection } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const e = await prisma.election.findFirst({ orderBy: { id: "asc" } });
  const status = e?.isOpen ? "DIBUKA" : "DITUTUP";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Pengaturan
        </h1>
        <p className="text-muted-foreground">
          Kelola status dan pengaturan pemilihan
        </p>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold">Status Pemilihan</h2>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              e?.isOpen
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {status}
          </span>
        </div>
        {e && (
          <p className="text-sm text-muted-foreground">
            {e.name} · {new Date(e.startAt).toLocaleString()} →{" "}
            {new Date(e.endAt).toLocaleString()}
          </p>
        )}
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Buka Pemilihan</h3>
        <form
          action={openElection}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Nama Pemilihan
            </label>
            <input
              name="name"
              defaultValue={e?.name ?? "Pemilu OSIS"}
              className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Durasi (jam)
            </label>
            <input
              name="durationH"
              type="number"
              min={1}
              defaultValue={8}
              className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Buka Pemilihan
            </button>
          </div>
        </form>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Tutup Pemilihan</h3>
        <form action={closeElection}>
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 px-8"
          >
            Tutup Sekarang
          </button>
        </form>
      </div>
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
