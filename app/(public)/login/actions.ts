"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function doLogin(_: any, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  try {
    await signIn("credentials", { redirectTo: next, email, password });
    redirect(next);
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return { error: "Email atau password salah." };
      }
      return { error: "Gagal masuk. Coba lagi." };
    }
    throw err;
  }
}
