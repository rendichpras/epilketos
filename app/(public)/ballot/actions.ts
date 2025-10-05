"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verify as verifySig } from "@/lib/crypto";

export async function castVote(formData: FormData) {
  "use server";
  const jar = await cookies();
  const signed = jar.get("ballot")?.value;
  if (!signed) redirect("/token?e=invalid");

  const payload = verifySig(signed);
  if (!payload) redirect("/token?e=invalid");

  const { th } = JSON.parse(payload) as {
    th: string;
  };

  const candidatePairId = Number(formData.get("candidatePairId") ?? 0);
  if (!Number.isInteger(candidatePairId) || candidatePairId <= 0) {
    redirect("/ballot?e=choose");
  }

  const now = new Date();
  const election = await prisma.election.findFirst({
    where: { isOpen: true, startAt: { lte: now }, endAt: { gt: now } },
  });
  if (!election) redirect("/token?e=closed");

  const voteId = await prisma.$transaction(async (tx) => {
    const upd = await tx.token.updateMany({
      where: {
        tokenHash: th,
        status: "unused",
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      data: { status: "used", usedAt: now },
    });
    if (upd.count !== 1) {
      throw new Error("TOKEN_ALREADY_USED_OR_INVALID");
    }

    const vote = await tx.vote.create({
      data: { candidatePairId },
      select: { id: true },
    });
    return vote.id;
  });

  jar.delete("ballot");

  const receipt = voteId.slice(-8).toUpperCase();
  jar.set({
    name: "receipt",
    value: receipt,
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 5 * 60,
  });

  redirect("/thanks");
}
