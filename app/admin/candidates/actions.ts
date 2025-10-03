"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getStr(fd: FormData, k: string) {
  return String(fd.get(k) ?? "").trim();
}
function getInt(fd: FormData, k: string) {
  const v = Number(getStr(fd, k));
  if (!Number.isInteger(v) || v <= 0) throw new Error(`invalid_${k}`);
  return v;
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCandidate(fd: FormData) {
  "use server";
  const nomorUrut = getInt(fd, "nomorUrut");
  const ketua = getStr(fd, "ketua");
  const wakil = getStr(fd, "wakil");
  const slugSrc = getStr(fd, "slug") || `${ketua}-${wakil}`;
  const slug = slugify(slugSrc);
  const fotoUrl = getStr(fd, "fotoUrl");
  const visi = getStr(fd, "visi");
  const misi = getStr(fd, "misi");

  if (!ketua || !wakil || !slug) throw new Error("invalid_form");

  await prisma.candidatePair.create({
    data: { nomorUrut, ketua, wakil, slug, fotoUrl, visi, misi, aktif: true },
  });

  revalidatePath("/admin/candidates");
  redirect("/admin/candidates");
}

export async function updateCandidate(fd: FormData) {
  "use server";
  const id = getInt(fd, "id");
  const nomorUrut = getInt(fd, "nomorUrut");
  const ketua = getStr(fd, "ketua");
  const wakil = getStr(fd, "wakil");
  const slugSrc = getStr(fd, "slug") || `${ketua}-${wakil}`;
  const slug = slugify(slugSrc);
  const fotoUrl = getStr(fd, "fotoUrl");
  const visi = getStr(fd, "visi");
  const misi = getStr(fd, "misi");

  await prisma.candidatePair.update({
    where: { id },
    data: { nomorUrut, ketua, wakil, slug, fotoUrl, visi, misi },
  });
  revalidatePath("/admin/candidates");
  redirect("/admin/candidates");
}

export async function deleteCandidate(fd: FormData) {
  "use server";
  const id = getInt(fd, "id");
  await prisma.candidatePair.delete({ where: { id } });
  revalidatePath("/admin/candidates");
  redirect("/admin/candidates");
}

export async function toggleActive(fd: FormData) {
  "use server";
  const id = getInt(fd, "id");
  const curr = await prisma.candidatePair.findUnique({
    where: { id },
    select: { aktif: true },
  });
  if (!curr) throw new Error("not_found");
  await prisma.candidatePair.update({
    where: { id },
    data: { aktif: !curr.aktif },
  });
  revalidatePath("/admin/candidates");
  redirect("/admin/candidates");
}
