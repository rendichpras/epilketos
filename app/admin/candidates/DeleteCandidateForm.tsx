"use client";

type Props = {
  id: number;
  action: (fd: FormData) => Promise<void>;
};

export default function DeleteCandidateForm({ id, action }: Props) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Hapus kandidat ini?")) e.preventDefault();
  }
  return (
    <form action={action} onSubmit={onSubmit}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg border border-destructive/20 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
        Hapus
      </button>
    </form>
  );
}
