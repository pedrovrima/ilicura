// app/update-password/page.tsx
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createServerComponentClient,
  createServerActionClient,
} from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string };
}) {
  // 1) Create a Supabase client that reads/writes cookies
  const supabase = createServerComponentClient({ cookies, headers });

  // 2) If we're landed with a token_hash=…&type=recovery, verify it
  const { token_hash, type } = searchParams;
  if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash,
    });
    if (error) {
      return <p>Failed to verify link: {error.message}</p>;
    }
    // Remove the query params to clean up the URL
    redirect("/update-password");
  }

  // 3) Protect the page—ensure we now have a valid session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    // Not signed in (or session expired)
    redirect("/login?error=not_authenticated");
  }

  // 4) Server Action to update the password
  async function updatePassword(formData: FormData) {
    "use server";
    const newPassword = formData.get("password") as string;
    const supabaseServer = createServerActionClient({ cookies, headers });

    const { error } = await supabaseServer.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      // This will surface as a thrown error on the client
      throw new Error(error.message);
    }

    // On success, send them to login
    redirect("/login?password_reset=success");
  }

  // 5) Render the form
  return (
    <div
      style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Reset Your Password</h1>
      <form action={updatePassword}>
        <label htmlFor="password" style={{ display: "block", marginBottom: 8 }}>
          New Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            boxSizing: "border-box",
          }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Update Password
        </button>
      </form>
    </div>
  );
}
