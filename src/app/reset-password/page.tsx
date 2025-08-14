import { resetPassword } from "./actions";

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Reset Password</h1>
        <form action={resetPassword}>
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
