import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  console.log("called");
  const { code, password } = await req.json();
  const supabase = await createClient();
  const data2 = await supabase.auth.getSession();

  // Use Supabase to update the password using the code
  const { data, error } = await (
    await supabase
  ).auth.exchangeCodeForSession(code);
  console.log("data", data);
  if (error) {
    console.log("exchangeCodeForSession error", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Now update the password
  const { error: updateError } = await supabase.auth.updateUser(
    data.session?.user?.id,
    { password },
  );
  if (updateError) {
    console.log("updateError", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
