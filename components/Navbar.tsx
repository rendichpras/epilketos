import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Beranda"
          >
            <Image
              src="/logo_osis.webp"
              alt="Logo SMK CIHUY KAN DULU LE"
              width={36}
              height={36}
              className="rounded-lg transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base sm:text-lg tracking-tight group-hover:underline">
                E-PILKETOS
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                SMK CIHUY KAN DULU LE
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
