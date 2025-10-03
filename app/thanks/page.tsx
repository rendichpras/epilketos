import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function ThanksPage() {
  const jar = await cookies();
  const receipt = jar.get("receipt")?.value;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center">
      <div className="container max-w-md mx-auto px-4 py-6 md:py-8">
        <div className="w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Terima kasih!
          </h1>
          <p className="text-muted-foreground">
            Suara Anda telah berhasil tercatat
          </p>
        </div>

        {receipt && (
          <Alert>
            <AlertDescription className="text-center">
              <div className="font-medium mb-1">Nomor Tanda Terima</div>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {receipt}
              </code>
              <div className="text-xs mt-2 text-muted-foreground">
                Simpan nomor ini untuk keperluan audit panitia
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          asChild
        >
          <a href="/">Kembali ke Beranda</a>
        </Button>
        </div>
      </div>
    </div>
  );
}
