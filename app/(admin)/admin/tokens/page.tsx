import { prisma } from "@/lib/prisma";
import { generateTokens } from "./actions";
import GenerateTokensForm from "./GenerateTokensForm";

export const dynamic = "force-dynamic";

export default async function TokensAdminPage() {
  const batches = await prisma.tokenBatch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tokens: true } },
    },
  });

  const totals = await prisma.token.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const countByStatus = Object.fromEntries(
    totals.map((t) => [t.status, t._count._all])
  ) as Record<string, number>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Token
        </h1>
        <p className="text-muted-foreground">
          Buat dan kelola token untuk pemilih
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-3">Generate Token</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Token 8-karakter memakai alfabet <em>Crockford Base32</em> (tanpa
          I/L/O/U), dibangkitkan dengan
          <code className="mx-1 rounded bg-muted px-2 py-0.5 text-muted-foreground font-mono text-sm">
            crypto.randomBytes()
          </code>
        </p>

        <div className="mb-4">
          <GenerateTokensForm action={generateTokens} />
        </div>

        <p className="text-xs text-muted-foreground">
          CSV berisi plaintext token hanya dikirim ke browser Anda (tidak
          disimpan di server/DB).
        </p>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Ringkasan</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Stat
            label="Token Belum Digunakan"
            value={countByStatus["unused"] ?? 0}
          />
          <Stat label="Token Terpakai" value={countByStatus["used"] ?? 0} />
          <Stat label="Total Batch" value={batches.length} />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Batch</h2>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Waktu
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Jumlah
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Kadaluarsa
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {batches.map((b) => (
                <tr
                  key={b.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    {b.createdAt.toLocaleString()}
                  </td>
                  <td className="p-4 align-middle">{b._count.tokens}</td>
                  <td className="p-4 align-middle">
                    {b.expiresAt ? new Date(b.expiresAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-4 align-middle">{b.note ?? "-"}</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-muted-foreground"
                  >
                    Belum ada batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
