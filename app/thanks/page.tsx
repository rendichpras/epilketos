import { cookies } from "next/headers";
import { CheckCircle2 } from "lucide-react";

export default async function ThanksPage() {
  const jar = await cookies();
  const receipt = jar.get("receipt")?.value;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center flex flex-col items-center gap-8">
          {/* Success Icon */}
          <div className="p-3 rounded-full bg-primary/5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Message */}
          <div className="animate-in fade-in-50">
            <h1 className="text-3xl font-bold mb-3 text-primary">
              Terima Kasih!
            </h1>
            <p className="text-lg text-muted-foreground">
              Suara Anda telah berhasil tercatat dalam sistem
            </p>
          </div>

          {/* Receipt */}
          {receipt && (
            <div className="w-full rounded-xl border bg-card/50 p-6 animate-in fade-in-50">
              <div className="space-y-3">
                <h2 className="font-medium text-primary">
                  Nomor Tanda Terima
                </h2>
                <div className="w-full rounded-lg border bg-background/50 p-3">
                  <code className="block font-mono text-sm tracking-wider">
                    {receipt}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Simpan nomor ini sebagai bukti partisipasi Anda dalam pemilihan
                </p>
              </div>
            </div>
          )}

          {/* Back Button */}
          <a 
            href="/" 
            className="h-12 px-8 rounded-lg border bg-card hover:bg-accent flex items-center justify-center animate-in fade-in-50"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
