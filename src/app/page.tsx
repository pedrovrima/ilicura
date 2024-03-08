import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";
import Image from "next/image";

import LoadedSpeciesSearch from "../components/loaded-species-search/search";

export default async function Home() {
  noStore();
  const speciesList = await api.species.getAllSpecies.query();

  return (
    <main className="flex min-h-screen flex-col bg-secondary-foreground text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <Image src="/logo.png" alt="oama logo" width={150} height={150} />
        <h1 className="text-5xl font-extrabold tracking-tight text-secondary sm:text-[5rem]">
          Wiki<span className="text-primary">Mudas</span>
        </h1>
        <LoadedSpeciesSearch speciesList={speciesList} />
      </div>
    </main>
  );
}
