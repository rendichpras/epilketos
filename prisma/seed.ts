import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const adminEmail = "admin@sekolah.sch.id";
const adminPass = "admin123";
const hash = await bcrypt.hash(adminPass, 10);

function randomToken8() {
  let out = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out.slice(0, 4) + "-" + out.slice(4, 8);
}

function normalizeToken(raw: string) {
  return raw.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

function hashToken(token: string) {
  const pepper = process.env.TOKEN_PEPPER ?? "";
  return crypto.createHmac("sha256", pepper).update(token).digest("hex");
}

async function main() {
  console.log("Generate sample tokens:");
  const arr = Array.from({ length: 12 }).map(() => randomToken8());
  for (const t of arr) {
    const norm = normalizeToken(t);
    await prisma.token.create({
      data: { tokenHash: hashToken(norm), status: "unused" },
    });
    console.log("  -", t);
  }

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: hash },
  });
  console.log("Admin siap:", adminEmail, "(password:", adminPass, ")");

  await prisma.candidatePair.createMany({
    data: [
      {
        slug: "alpha",
        nomorUrut: 1,
        ketua: "Alya Pratama",
        wakil: "Bima Saputra",
        fotoUrl: "",
        visi: "OSIS yang inklusif & aktif",
        misi: "1) Program literasi 2) Kegiatan seni 3) Lingkungan",
        aktif: true,
      },
      {
        slug: "bravo",
        nomorUrut: 2,
        ketua: "Citra Wulandari",
        wakil: "Dimas Herlambang",
        fotoUrl: "",
        visi: "OSIS kreatif & disiplin",
        misi: "1) Kompetisi olahraga 2) Kedisiplinan 3) Kewirausahaan",
        aktif: true,
      },
    ],
    skipDuplicates: true,
  });

  const now = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.election.upsert({
    where: { id: 1 },
    update: {
      startAt: now,
      endAt: tomorrow,
      isOpen: true,
      name: "Pemilu OSIS 2025",
    },
    create: {
      id: 1,
      name: "Pemilu OSIS 2025",
      startAt: now,
      endAt: tomorrow,
      isOpen: true,
    },
  });

  console.log("Seeded candidates & election.");
}

main().finally(async () => prisma.$disconnect());