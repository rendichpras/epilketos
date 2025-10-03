"use server";

import { revalidatePath } from "next/cache";

export async function refreshResults() {
  "use server";
  revalidatePath("/admin/results");
}
