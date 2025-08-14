import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // “recovery”
  const redirectTo = searchParams.get("redirectTo") || "/update-password";

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as "recovery" | "signup",
      token_hash,
    });
    if (!error) {
      // now the session is set in cookies/localStorage
      return NextResponse.redirect(redirectTo);
    }
  }
  return NextResponse.redirect("/error");
}
