import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [totalVotes, totalCandidates, usedTokens] = await Promise.all([
    prisma.vote.count(),
    prisma.candidatePair.count(),
    prisma.token.count({ where: { status: "used" } }),
  ]);

  return (
    <main className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-3xl font-semibold">{totalVotes}</div>
          <div className="text-gray-500">Total Suara</div>
        </div>
        <div className="card">
          <div className="text-3xl font-semibold">{usedTokens}</div>
          <div className="text-gray-500">Token Terpakai</div>
        </div>
        <div className="card">
          <div className="text-3xl font-semibold">{totalCandidates}</div>
          <div className="text-gray-500">Pasangan Kandidat</div>
        </div>
      </div>
      <div className="card">
        <li>
          <a className="underline" href="/admin/results">
            Lihat hasil & grafik
          </a>
        </li>
      </div>
    </main>
  );
}
