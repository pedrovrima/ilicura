"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={signOut}
      className="rounded-md bg-gray-900 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
