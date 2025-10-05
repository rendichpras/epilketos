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

  const byCandidate = candidates
    .map((c) => {
      const row = grouped.find((g) => g.candidatePairId === c.id);
      return {
        id: c.id,
        nomor: c.nomorUrut,
        name: `#${c.nomorUrut} ${c.ketua} & ${c.wakil}`,
        votes: row?._count._all ?? 0,
      };
    })
    .sort((a, b) => b.votes - a.votes);

  const participation = totalTokens
    ? Math.round((totalTokensUsed / totalTokens) * 100)
    : 0;

  const chartData = byCandidate.map((r) => ({
    name: `#${r.nomor}`,
    votes: r.votes,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Hasil Pemilihan
        </h1>
        <p className="text-muted-foreground">
          Lihat hasil dan statistik pemilihan
        </p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ringkasan</h2>
          <form action={refreshResults}>
            <button
              className="rounded-lg border border-input px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              type="submit"
            >
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
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Perolehan Suara per Pasangan</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Pasangan</th>
                <th className="py-2 pr-4">Suara</th>
              </tr>
            </thead>
            <tbody>
              {byCandidate.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="whitespace-nowrap py-3 pr-4 font-medium">
                    {r.nomor}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">
                    {r.name.replace(/^#\d+\s/, "")}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">{r.votes}</td>
                </tr>
              ))}
              {byCandidate.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <a
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/admin/results/export"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Grafik</h2>
        <div className="mt-4">
          <ResultsChart data={chartData} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Grafik ini dirender di Client Component (Recharts).
        </p>
      </div>

      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        ← Kembali ke Dashboard
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50">
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
