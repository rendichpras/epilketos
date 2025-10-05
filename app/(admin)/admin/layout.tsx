import "@/app/globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Admin Panel - E-Pilketos",
  description: "Halaman administrator E-Pilketos",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="min-h-screen">
      <body className="bg-background text-foreground min-h-screen antialiased">
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <h2 className="lg:hidden text-lg font-semibold">E-Pilketos</h2>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border px-4 h-10 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </header>
            <main className="flex-1">
              <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
