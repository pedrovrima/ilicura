// src/app/login/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `/set-new-password`,
  });
  if (error) {
    console.error(error);
    // handle error (e.g., return error message)
    return;
  }
  redirect("/admin/species");
}
