import { prisma } from "@/lib/prisma";

export default async function ElectionBanner() {
  const e = await prisma.election.findFirst({
    orderBy: { id: "asc" },
    select: { isOpen: true, startAt: true, endAt: true },
  });

  const now = new Date();
  const open =
    !!e &&
    e.isOpen &&
    (!e.startAt || e.startAt <= now) &&
    (!e.endAt || e.endAt > now);

  const text = open
    ? "Pemungutan suara sedang berlangsung."
    : "Pemungutan suara telah berakhir.";

  return (
    <div
      className={
        open
          ? "bg-emerald-600/95 text-emerald-50"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800/90 dark:text-gray-300"
      }
    >
      <div className="container mx-auto px-4 py-2.5 text-center text-sm font-medium">
        {text}
      </div>
    </div>
  );
}
