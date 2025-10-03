import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verify as verifySig } from "@/lib/crypto";
import SubmitVoteButton from "./SubmitVoteButton";
import Image from "next/image";
import { castVote } from "./actions";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <form action={castVote} className="flex flex-col flex-1">
        <div className="flex-1 overflow-auto">
          <div className="container px-4 py-12">
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Pilih Pasangan Kandidat
              </h1>
              <p className="text-base text-muted-foreground">
                Pilih <span className="font-medium">tepat satu</span> pasangan. Periksa kembali sebelum mengirim.
              </p>
            </div>

            <RadioGroup 
            name="candidatePairId"
            className={`grid gap-3 sm:gap-4 ${
            candidates.length === 1 ? 'grid-cols-1 max-w-[280px] sm:max-w-xs mx-auto' :
            candidates.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
            candidates.length === 3 ? 'grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto' :
            'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto'
          }`}
          required
        >
          {candidates.map((c) => (
            <div key={c.id} className="relative w-full">
              <RadioGroupItem
                value={String(c.id)}
                id={`candidate-${c.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`candidate-${c.id}`}
                className="flex flex-col h-full rounded-xl border bg-card shadow-sm overflow-hidden hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary transition-all cursor-pointer"
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
              </Label>
            </div>
          ))}
        </RadioGroup>

        </div>
      </div>

        <div className="sticky bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t">
          <div className="container max-w-5xl mx-auto px-4 py-6">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base py-6"
                asChild
              >
                <a href="/token">Kembali</a>
              </Button>
              <SubmitVoteButton />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}