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
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Generate Token</h2>
        <p className="mt-1 text-gray-600">
          Token 8-karakter memakai alfabet <em>Crockford Base32</em> (tanpa
          I/L/O/U), dibangkitkan dengan
          <code className="mx-1 rounded bg-gray-100 px-2 py-0.5">
            crypto.randomBytes()
          </code>
          .
        </p>
        <div className="mt-4">
          <GenerateTokensForm action={generateTokens} />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          CSV berisi plaintext token hanya dikirim ke browser Anda (tidak
          disimpan di server/DB).
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Ringkasan</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-3">
          <Stat label="Token (unused)" value={countByStatus["unused"] ?? 0} />
          <Stat label="Token (used)" value={countByStatus["used"] ?? 0} />
          <Stat label="Batch total" value={batches.length} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Daftar Batch</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">Waktu</th>
                <th className="py-2 pr-4">Jumlah</th>
                <th className="py-2 pr-4">Kadaluarsa</th>
                <th className="py-2 pr-4">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="py-2 pr-4">{b.createdAt.toLocaleString()}</td>
                  <td className="py-2 pr-4">{b._count.tokens}</td>
                  <td className="py-2 pr-4">
                    {b.expiresAt ? new Date(b.expiresAt).toLocaleString() : "-"}
                  </td>
                  <td className="py-2 pr-4">{b.note ?? "-"}</td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    Belum ada batch.
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
