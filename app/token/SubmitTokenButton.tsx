"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitTokenButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      size="lg"
      className="w-full sm:w-auto text-base py-6"
    >
      {pending ? "Memverifikasi…" : "Verifikasi Token"}
    </Button>
  );
}