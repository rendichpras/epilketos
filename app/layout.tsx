import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import ElectionBanner from "../components/ElectionBanner";

export const metadata: Metadata = {
  title: "E-Pilketos - SMK HS AGUNG",
  description: "Aplikasi Pemilihan Ketua & Wakil OSIS SMK HS AGUNG",
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
        <main className="flex-1">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
