import { prisma } from "@/lib/prisma";
import ResultsChart from "./ResultChart";
import { refreshResults } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const [totalVotes, totalTokensUsed, totalTokens, candidates] =
    await Promise.all([
      prisma.vote.count(),
      prisma.token.count({ where: { status: "used" } }),
      prisma.token.count(),
      prisma.candidatePair.findMany({
        where: { aktif: true },
        orderBy: { nomorUrut: "asc" },
      }),
    ]);

  const grouped = await prisma.vote.groupBy({
    by: ["candidatePairId"],
    _count: { _all: true },
  });
  const byCandidate = candidates.map((c) => {
    const row = grouped.find((g) => g.candidatePairId === c.id);
    return {
      id: c.id,
      nomor: c.nomorUrut,
      name: `#${c.nomorUrut} ${c.ketua} & ${c.wakil}`,
      votes: row?._count._all ?? 0,
    };
  });
  byCandidate.sort((a, b) => b.votes - a.votes);

  const participation = totalTokens
    ? Math.round((totalTokensUsed / totalTokens) * 100)
    : 0;
  const chartData = byCandidate.map((r) => ({
    name: `#${r.nomor}`,
    votes: r.votes,
  }));

  return (
    <main className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ringkasan</h2>
          <form action={refreshResults}>
            <button className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50">
              Refresh
            </button>
          </form>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <Stat label="Total Suara" value={totalVotes} />
          <Stat label="Token Terpakai" value={totalTokensUsed} />
          <Stat label="Token Tersedia" value={totalTokens} />
          <Stat label="Partisipasi" value={`${participation}%`} />
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Perolehan Suara per Pasangan</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Pasangan</th>
                <th className="py-2 pr-4">Suara</th>
              </tr>
            </thead>
            <tbody>
              {byCandidate.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2 pr-4 font-medium">{r.nomor}</td>
                  <td className="py-2 pr-4">{r.name.replace(/^#\d+\s/, "")}</td>
                  <td className="py-2 pr-4">{r.votes}</td>
                </tr>
              ))}
              {byCandidate.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <a
            className="btn-primary rounded-xl px-4 py-2"
            href="/admin/results/export"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Grafik</h2>
        <ResultsChart data={chartData} />
        <p className="mt-3 text-xs text-gray-500">
          Grafik ini dirender di Client Component (Recharts).
        </p>
      </div>

      <Link href="/admin" className="text-sm text-gray-600 hover:underline">
        Kembali ke Dashboard
      </Link>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
