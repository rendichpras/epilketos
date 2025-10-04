"use client";

export default function StartButton() {
  return (
    <a 
      href="/token" 
      className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-6 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl sm:py-8 sm:text-lg md:text-xl"
    >
      Mulai Pemilihan
    </a>
  );
}