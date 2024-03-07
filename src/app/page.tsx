import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";

import LoadedSpeciesSearch from "../components/loaded-species-search/search";

export default async function Home() {
  noStore();
  const speciesList = await api.species.getAllSpecies.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#65590c] to-[#272c15] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Image src="https://ik.imagekit.io/ilicura/DSC_0206_5S-fgP5iu.JPG" />
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Wiki<span className="text-[hsl(50,100%,70%)]">Mudas</span>
        </h1>
        <LoadedSpeciesSearch speciesList={speciesList} />
      </div>
    </main>
  );
}
