import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(creds?.password ?? "");
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;
        const ok = await compare(password, admin.passwordHash);
        return ok ? { id: admin.id, email: admin.email, role: "ADMIN" } : null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});