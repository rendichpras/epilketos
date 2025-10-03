"use client";

import StartButton from "@/components/StartButton";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center">
      <div className="container max-w-3xl mx-auto px-4 py-6 md:py-8">
        {/* Main Content */}
        <div className="space-y-8 md:space-y-12">
          {/* Hero & CTA */}
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
                di sistem pemilihan ketua & wakil ketua OSIS SMK HS AGUNG periode 2025/2026
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-3">
              <StartButton />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Gunakan token yang telah diberikan oleh panitia
              </p>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
            {/* Tata Cara */}
            <div className="space-y-3 md:space-y-4 p-4 sm:p-6 bg-muted/50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold">Tata Cara</h2>
              <ol className="list-decimal pl-5 space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground marker:text-primary marker:font-medium">
                <li className="pl-2">Siapkan token dari panitia</li>
                <li className="pl-2">Masukkan token untuk verifikasi</li>
                <li className="pl-2">Pilih kandidat sesuai pilihan</li>
                <li className="pl-2">Konfirmasi pilihan Anda</li>
              </ol>
            </div>

            {/* Perhatian */}
            <div className="space-y-3 md:space-y-4 p-4 sm:p-6 bg-muted/50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold">Perhatian</h2>
              <ul className="list-disc pl-5 space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground marker:text-primary marker:font-medium">
                <li className="pl-2">Pemilihan hanya dapat dilakukan satu kali</li>
                <li className="pl-2">Pastikan koneksi internet stabil</li>
                <li className="pl-2">Jaga kerahasiaan token Anda</li>
                <li className="pl-2">Pilihan bersifat final dan tidak dapat diubah</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
