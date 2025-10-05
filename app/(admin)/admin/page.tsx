import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [totalVotes, totalCandidates, usedTokens] = await Promise.all([
    prisma.vote.count(),
    prisma.candidatePair.count(),
    prisma.token.count({ where: { status: "used" } }),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di panel administrasi E-Pilketos
        </p>
      </header>
      <section aria-labelledby="stats" className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50">
          <div className="text-3xl font-bold text-foreground">{totalVotes}</div>
          <div className="mt-1 text-sm text-muted-foreground">Total Suara</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50">
          <div className="text-3xl font-bold text-foreground">{usedTokens}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Token Terpakai
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50">
          <div className="text-3xl font-bold text-foreground">
            {totalCandidates}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Pasangan Kandidat
          </div>
        </div>
      </section>

      <section
        aria-labelledby="quick-actions"
        className="rounded-xl border bg-card"
      >
        <div className="p-6">
          <h2 id="quick-actions" className="text-lg font-semibold mb-4">
            Aksi Cepat
          </h2>
          <ul className="space-y-3">
            <li>
              <a
                href="/admin/results"
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 hover:underline"
              >
                Lihat hasil & grafik pemilihan
                <svg
                  className="ml-1 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
