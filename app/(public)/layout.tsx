import "@/app/globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ElectionBanner from "@/components/ElectionBanner";

export const metadata: Metadata = {
  title: "E-Pilketos - SMK CIHUY KAN DULU LE",
  description: "Aplikasi Pemilihan Ketua & Wakil OSIS SMK CIHUY KAN DULU LE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="min-h-screen">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <ElectionBanner />
        <main className="flex-1 grid place-items-center">
          <div className="container mx-auto max-w-4xl px-4 py-12 w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
