"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function StartButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full h-auto text-base sm:text-lg md:text-xl py-6 sm:py-8 rounded-xl shadow-lg hover:shadow-xl transition-all" 
          size="lg"
        >
          Mulai Pemilihan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pakta Integritas Pemilih</DialogTitle>
          <DialogDescription>
            Dengan ini saya menyatakan:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <ul className="list-disc pl-4 space-y-2">
            <li>Akan memberikan suara dengan <span className="font-medium">JUJUR</span> sesuai dengan hati nurani</li>
            <li>Tidak akan terpengaruh oleh tekanan atau paksaan dari pihak manapun</li>
            <li>Menjaga kerahasiaan pilihan dan tidak membagikan informasi token kepada orang lain</li>
            <li>Menghormati hasil akhir pemilihan yang akan diumumkan oleh panitia</li>
          </ul>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(false)}
          >
            Batal
          </Button>
          <Button asChild>
            <a href="/token">Saya Setuju & Lanjutkan</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}