import { login } from "./actions";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { WhoIAmButton } from "@/components/whoAmI";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();

  const data = await supabase.auth.getSession();

  if (data.data.session) redirect("/admin/species");
  return (
    <main className="flex min-h-screen flex-col bg-[#f1e4ca]  text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <img
          src="/admin.jpeg"
          alt="oama logo"
          width={150}
          height={150}
          className="mb-2"
        />
        <h1 className="text-5xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
          Admin<span className="text-primary">Login</span>
        </h1>
        <form
          action={login}
          className="flex w-full max-w-sm flex-col gap-6 rounded-xl bg-white p-8 shadow-lg"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="rounded border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="rounded bg-primary py-2 font-semibold text-white transition hover:bg-primary/80"
          >
            Login
          </button>
          <Link href="/reset-password" className="text-sm text-gray-500">
            Reset Password
          </Link>
        </form>
      </div>
      <WhoIAmButton />
    </main>
  );
}
