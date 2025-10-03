import { signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin · OSIS Vote</h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Keluar
            </button>
          </form>
        </header>
        {children}
      </div>
    </section>
  );
}
