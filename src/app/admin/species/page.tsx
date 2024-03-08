import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";
import Image from "next/image";
import SpeciesSearch from "@/components/species-search/search";

export default async function Home() {
  noStore();
  const speciesList = await api.species.getAllSpecies.query();

  return (
    <main className="flex min-h-screen flex-col bg-background text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <Image src="/admin.jpeg" alt="oama logo" width={150} height={150} />
        <h1 className="text-5xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
          Admin<span className="text-primary">Mode</span>
        </h1>
        <SpeciesSearch />
      </div>
    </main>
  );
}
