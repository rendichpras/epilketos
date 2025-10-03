// app/ballot/SubmitVoteButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitVoteButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="w-full sm:w-auto py-6 text-base"
    >
      {pending ? "Mengirim…" : "Kirim Suara"}
    </Button>
  );
}
