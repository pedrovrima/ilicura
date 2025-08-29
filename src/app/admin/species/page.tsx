import { unstable_noStore as noStore } from "next/cache";
export const dynamic = "force-dynamic";
import Image from "next/image";
import SpeciesSearch from "@/components/species-search/search";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { WhoIAmButton } from "@/components/whoAmI";

export default async function Home() {
  noStore();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("redirecting to login");
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <Image src="/admin.jpeg" alt="oama logo" width={150} height={150} />
        <h1 className="text-5xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
          Admin<span className="text-primary">Mode</span>
        </h1>
        <SpeciesSearch />
      </div>
      <WhoIAmButton />
    </main>
  );
}
