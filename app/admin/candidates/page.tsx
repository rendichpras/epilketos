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
    <main className="space-y-6">
      <div className="card">
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
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Slug (opsional)</label>
            <input
              name="slug"
              placeholder="alpha"
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Ketua</label>
            <input
              name="ketua"
              required
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Wakil</label>
            <input
              name="wakil"
              required
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Foto URL (opsional)</label>
            <input
              name="fotoUrl"
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Visi</label>
            <textarea
              name="visi"
              rows={3}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Misi</label>
            <textarea
              name="misi"
              rows={3}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary h-11 rounded-xl px-5">Tambah</button>
          </div>
        </form>
      </div>
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Daftar Kandidat</h2>
          <Link href="/admin" className="text-sm text-gray-600 hover:underline">
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Pasangan</th>
                <th className="py-2 pr-4">Slug</th>
                <th className="py-2 pr-4">Aktif</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 pr-4 font-medium">{c.nomorUrut}</td>
                  <td className="py-2 pr-4">
                    {c.ketua} &amp; {c.wakil}
                  </td>
                  <td className="py-2 pr-4 text-gray-600">{c.slug}</td>
                  <td className="py-2 pr-4">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50">
                        {c.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/candidates/${c.id}/edit`}
                        className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
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
                  <td colSpan={5} className="py-6 text-center text-gray-500">
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
