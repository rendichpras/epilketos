import { prisma } from "@/lib/prisma";
import { createCandidate, deleteCandidate, toggleActive } from "./actions";
import Link from "next/link";
import DeleteCandidateForm from "./DeleteCandidateForm";

export const dynamic = "force-dynamic";

export default async function CandidatesAdminPage() {
  const list = await prisma.candidatePair.findMany({
    orderBy: { nomorUrut: "asc" },
  });

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Kandidat</h1>
        <p className="text-muted-foreground">Kelola daftar pasangan kandidat</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Tambah Pasangan Kandidat</h2>
        <form
          action={createCandidate}
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <div>
            <label className="text-sm text-gray-700">Nomor Urut</label>
            <input
              name="nomorUrut"
              type="number"
              min={1}
              required
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Slug (opsional)</label>
            <input
              name="slug"
              placeholder="alpha"
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Ketua</label>
            <input
              name="ketua"
              required
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Wakil</label>
            <input
              name="wakil"
              required
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Foto URL (opsional)</label>
            <input
              name="fotoUrl"
              placeholder="https://..."
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Visi</label>
            <textarea
              name="visi"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Misi</label>
            <textarea
              name="misi"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="md:col-span-2">
            <button className="h-10 rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Tambah
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Daftar Kandidat</h2>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="text-left text-gray-500 bg-gray-50">
              <tr>
                <th className="whitespace-nowrap py-3 pr-4 font-medium">#</th>
                <th className="whitespace-nowrap py-3 pr-4 font-medium">Pasangan</th>
                <th className="whitespace-nowrap py-3 pr-4 font-medium">Slug</th>
                <th className="whitespace-nowrap py-3 pr-4 font-medium">Aktif</th>
                <th className="whitespace-nowrap py-3 pr-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="whitespace-nowrap py-3 pr-4 font-medium">{c.nomorUrut}</td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    {c.ketua} &amp; {c.wakil}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{c.slug}</td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                        {c.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </form>
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/candidates/${c.id}/edit`}
                        className="rounded-lg border border-input px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Edit
                      </Link>
                      <DeleteCandidateForm id={c.id} action={deleteCandidate} />
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    Belum ada kandidat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}