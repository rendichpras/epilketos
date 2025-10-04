import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { castVote } from "./actions";
import { prisma } from "@/lib/prisma";
import { verify as verifySig } from "@/lib/crypto";
import { SubmitButton } from "./submit-button";

export default async function BallotPage() {
  const jar = await cookies();
  const signed = jar.get("ballot")?.value;
  if (!signed) redirect("/token");

  const payload = verifySig(signed);
  if (!payload) redirect("/token");

  const candidates = await prisma.candidatePair.findMany({
    where: { aktif: true },
    orderBy: { nomorUrut: "asc" },
  });
  if (!candidates.length) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
        <div className="container px-4">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Surat Suara</h1>
            <p className="text-muted-foreground">Belum ada kandidat aktif saat ini.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] pb-24">
      <form action={castVote}>
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              Surat Suara Digital
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Pilih <span className="font-medium text-foreground">satu pasangan kandidat</span> dengan teliti
            </p>
          </div>

          {/* Candidate Grid */}
          <div
            className={`grid gap-6 ${
              candidates.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              candidates.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' :
              'sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
            }`}
          >
            {candidates.map((c) => (
              <div key={c.id} className="relative w-full">
                <input
                  type="radio"
                  name="candidatePairId"
                  value={String(c.id)}
                  id={`candidate-${c.id}`}
                  className="peer sr-only"
                  required
                />
                <label
                  htmlFor={`candidate-${c.id}`}
                  className="flex flex-col h-full rounded-xl border bg-card shadow-sm overflow-hidden hover:bg-accent/50 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all cursor-pointer"
                >
                  <div className="aspect-[3/4] sm:aspect-[4/5] relative w-full bg-muted">
                    {c.fotoUrl ? (
                      <Image
                        src={c.fotoUrl}
                        alt={`${c.ketua} & ${c.wakil}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 384px, (min-width: 768px) 288px, 100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Tidak ada foto
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 text-xs font-medium rounded-md bg-background/80 backdrop-blur-sm">
                        #{c.nomorUrut}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 space-y-1">
                    <div>
                      <h3 className="text-sm font-medium leading-tight">
                        {c.ketua}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        &amp; {c.wakil}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {c.visi || "Visi belum diisi."}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-background to-background/80 backdrop-blur-sm border-t">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
              <a 
                href="/token" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 w-full sm:w-auto"
              >
                Kembali
              </a>
              <SubmitButton />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}