"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function openElection(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "Pemilu OSIS");
  const hours = Number(formData.get("durationH") ?? 8);
  const start = new Date();
  const end = new Date(Date.now() + Math.max(1, hours) * 60 * 60 * 1000);

  await prisma.election.upsert({
    where: { id: 1 },
    update: { name, startAt: start, endAt: end, isOpen: true },
    create: { id: 1, name, startAt: start, endAt: end, isOpen: true },
  });
  revalidatePath("/");
  revalidatePath("/ballot");
  revalidatePath("/admin/results");
  redirect("/admin/settings");
}

export async function closeElection() {
  "use server";
  const now = new Date();
  await prisma.election.updateMany({
    where: { isOpen: true },
    data: { isOpen: false, endAt: now },
  });
  revalidatePath("/");
  revalidatePath("/ballot");
  revalidatePath("/admin/results");
  redirect("/admin/settings");
}
