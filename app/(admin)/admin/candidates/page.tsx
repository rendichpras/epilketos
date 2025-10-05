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
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Kandidat
        </h1>
        <p className="text-muted-foreground">Kelola daftar pasangan kandidat</p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Tambah Pasangan Kandidat</h2>
        <form
          action={createCandidate}
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label="Nomor Urut"
            name="nomorUrut"
            type="number"
            min={1}
            required
          />
          <Input label="Slug (opsional)" name="slug" placeholder="alpha" />
          <Input label="Ketua" name="ketua" required />
          <Input label="Wakil" name="wakil" required />
          <Input
            label="Foto URL (opsional)"
            name="fotoUrl"
            className="md:col-span-2"
          />
          <Textarea label="Visi" name="visi" />
          <Textarea label="Misi" name="misi" />
          <div className="md:col-span-2">
            <button className="h-10 rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Tambah
            </button>
          </div>
        </form>
      </div>

      {/* Daftar Kandidat */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Daftar Kandidat</h2>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Pasangan</th>
                <th className="py-3 px-4 text-left">Slug</th>
                <th className="py-3 px-4 text-left">Aktif</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{c.nomorUrut}</td>
                  <td className="py-3 px-4">
                    {c.ketua} &amp; {c.wakil}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{c.slug}</td>
                  <td className="py-3 px-4">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-lg border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
                        {c.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </form>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/candidates/${c.id}/edit`}
                        className="rounded-lg border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
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
                  <td
                    colSpan={5}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Belum ada kandidat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    className?: string;
  }
) {
  return (
    <div className={props.className}>
      <label className="text-sm font-medium text-foreground">
        {props.label}
      </label>
      <input
        {...props}
        className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">
        {props.label}
      </label>
      <textarea
        {...props}
        className="mt-1 block w-full rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
