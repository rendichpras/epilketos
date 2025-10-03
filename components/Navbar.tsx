import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo_osis.webp" 
              alt="Logo SMK HS AGUNG" 
              width={36} 
              height={36}
              className="rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight">E-PILKETOS</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">SMK HS AGUNG</span>
            </div>
          </div>
          <div className="text-center flex-1 md:flex-none">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Pemilihan Ketua & Wakil Ketua OSIS
              <span className="hidden sm:inline"> Periode 2025/2026</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}