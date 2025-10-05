import { prisma } from "@/lib/prisma";

export async function GET() {
  const [pairs, grouped, totalVotes] = await Promise.all([
    prisma.candidatePair.findMany({ orderBy: { nomorUrut: "asc" } }),
    prisma.vote.groupBy({ by: ["candidatePairId"], _count: { _all: true } }),
    prisma.vote.count(),
  ]);

  const mapCount = new Map(
    grouped.map((g) => [g.candidatePairId, g._count._all])
  );
  const rows = pairs
    .map((c) => {
      const count = mapCount.get(c.id) ?? 0;
      return {
        nomor: c.nomorUrut,
        ketua: c.ketua,
        wakil: c.wakil,
        suara: count,
      };
    })
    .sort((a, b) => a.nomor - b.nomor);

  const header = "nomor_urut,ketua,wakil,suara\n";
  const body = rows
    .map(
      (r) =>
        `${r.nomor},"${r.ketua.replace(/"/g, '""')}","${r.wakil.replace(
          /"/g,
          '""'
        )}",${r.suara}`
    )
    .join("\n");
  const footer = `\nTOTAL,,,${totalVotes}\n`;
  const csv = header + body + footer;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hasil-pemilu.csv"`,
    },
  });
}
