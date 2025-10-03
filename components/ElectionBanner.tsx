import { prisma } from "@/lib/prisma";

function formatEndDate(date: Date) {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    // Jika kurang dari 24 jam, tampilkan jam tersisa
    return `${diffHours} jam tersisa`;
  } else {
    // Jika lebih dari 24 jam, tampilkan tanggal dan waktu
    return date.toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric'
    });
  }
}

export default async function ElectionBanner() {
  const e = await prisma.election.findFirst({ orderBy: { id: "asc" } });
  if (!e) return null;

  const now = new Date();
  const endDate = new Date(e.endAt);
  const open = e.isOpen && endDate > now;
  
  const text = open
    ? `Pemilu dibuka · Tutup ${formatEndDate(endDate)}`
    : "Pemilu sedang ditutup";

  return (
    <div className={`
      ${open ? "bg-emerald-600/95 text-emerald-50" : "bg-gray-100 text-gray-600 dark:bg-gray-800/90 dark:text-gray-300"}
      transition-colors duration-300 backdrop-blur-sm border-b
      ${open ? "border-emerald-500/20" : "border-gray-200/20 dark:border-gray-700/30"}
    `}>
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-1.5">
            {open ? (
              <>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                </div>
                <span>Live</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span>Ditutup</span>
              </>
            )}
          </div>
          {open && (
            <>
              <span className="text-emerald-300">·</span>
              <span>{formatEndDate(endDate)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
