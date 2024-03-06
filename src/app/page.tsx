import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import SpeciesSearch from "@/components/species-search/search";

export default async function Home() {
  noStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#65590c] to-[#272c15] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Wiki<span className="text-[hsl(50,100%,70%)]">Mudas</span>
        </h1>
        <Link href="/species/1248">ILIMIL</Link>

        <Link href="/species/1248">RHEAME</Link>
        <SpeciesSearch />
      </div>
    </main>
  );
}
