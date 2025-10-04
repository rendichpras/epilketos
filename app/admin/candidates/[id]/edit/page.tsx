import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCandidate } from "../../actions";
import Link from "next/link";

export default async function EditCandidatePage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const c = await prisma.candidatePair.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <main className="space-y-6 p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Edit Kandidat #{c.nomorUrut}</h2>
        <form
          action={updateCandidate}
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <input type="hidden" name="id" value={c.id} />
          <div>
            <label className="text-sm text-gray-700">Nomor Urut</label>
            <input
              name="nomorUrut"
              type="number"
              min={1}
              defaultValue={c.nomorUrut}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Slug</label>
            <input
              name="slug"
              defaultValue={c.slug}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Ketua</label>
            <input
              name="ketua"
              defaultValue={c.ketua}
              required
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Wakil</label>
            <input
              name="wakil"
              defaultValue={c.wakil}
              required
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Foto URL</label>
            <input
              name="fotoUrl"
              defaultValue={c.fotoUrl ?? ""}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Visi</label>
            <textarea
              name="visi"
              rows={3}
              defaultValue={c.visi ?? ""}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Misi</label>
            <textarea
              name="misi"
              rows={3}
              defaultValue={c.misi ?? ""}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button className="h-10 rounded-lg bg-blue-600 px-4 font-medium text-white transition-colors hover:bg-blue-700">Simpan</button>
            <Link
              href="/admin/candidates"
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
