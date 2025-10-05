"use client";

import StartButton from "@/components/StartButton";
import { ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">
              E-Pilketos
            </h1>
            <p className="text-xl text-muted-foreground">
              Sistem Pemilihan Ketua & Wakil Ketua OSIS SMK CIHUY KAN DULU LE
              <br />
              Periode 2025/2026
            </p>
          </div>
          <div className="w-full max-w-sm">
            <StartButton />
            <p className="mt-3 text-sm text-center text-muted-foreground">
              Masukkan token yang diberikan oleh panitia untuk memulai
            </p>
          </div>
          <div className="w-full grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg border flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Langkah Pemilihan</h2>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>Siapkan token dari panitia</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <span>Masukkan token untuk verifikasi</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <span>Pilih kandidat sesuai pilihan Anda</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium">
                    4
                  </div>
                  <span>Konfirmasi dan kirim pilihan</span>
                </li>
              </ol>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg border flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Penting</h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Pemilihan hanya dapat dilakukan satu kali</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Pastikan koneksi internet stabil</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Jaga kerahasiaan token Anda</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Pilihan bersifat final dan tidak dapat diubah</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
