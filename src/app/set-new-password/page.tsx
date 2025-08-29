"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call your API route or server action to update the password
    const res = await fetch("/api/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password }),
    });
    if (res.ok) {
      setMessage("Password reset successful!");
      router.push("/admin/species");
    } else {
      setMessage("Error resetting password.");
    }
  };

  if (!code) {
    return (
      <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
        <div className="container flex flex-col items-center justify-center px-4 py-16">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="text-red-500">Invalid or missing reset code.</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <img
          src="/admin.jpeg"
          alt="oama logo"
          width={150}
          height={150}
          className="mb-2"
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-secondary-foreground sm:text-[3rem]">
          Set <span className="text-primary">New Password</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-6 rounded-xl bg-white p-8 shadow-lg"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="rounded bg-primary py-2 font-semibold text-white transition hover:bg-primary/80"
          >
            Reset Password
          </button>
          {message && (
            <div
              className={`text-center ${
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
