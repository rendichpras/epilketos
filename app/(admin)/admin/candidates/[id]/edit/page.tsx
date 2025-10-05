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
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Edit Kandidat #{c.nomorUrut}
        </h2>
        <form
          action={updateCandidate}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input type="hidden" name="id" value={c.id} />
          <Input
            label="Nomor Urut"
            name="nomorUrut"
            type="number"
            defaultValue={c.nomorUrut}
            required
          />
          <Input label="Slug" name="slug" defaultValue={c.slug ?? ""} />
          <Input label="Ketua" name="ketua" defaultValue={c.ketua} required />
          <Input label="Wakil" name="wakil" defaultValue={c.wakil} required />
          <Input
            label="Foto URL"
            name="fotoUrl"
            defaultValue={c.fotoUrl ?? ""}
            className="md:col-span-2"
          />
          <Textarea label="Visi" name="visi" defaultValue={c.visi ?? ""} />
          <Textarea label="Misi" name="misi" defaultValue={c.misi ?? ""} />
          <div className="md:col-span-2 flex items-center gap-3">
            <button className="h-10 rounded-lg bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90">
              Simpan
            </button>
            <Link
              href="/admin/candidates"
              className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Batal
            </Link>
          </div>
        </form>
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
