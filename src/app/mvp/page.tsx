import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";
import Link from "next/link";

import LoadedSpeciesSearch from "../../components/loaded-species-search/search";
import Maintanance from "../maintanance";
import Image from "next/image";

export default async function Home() {
  noStore();
  const speciesList = await api.species.getAllSpecies.query();

  return (
    <main className="flex min-h-screen flex-col bg-[#f1e4ca] text-secondary">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <div className="mb-4 flex flex-col items-end">
          <div className="flex items-baseline gap-2">
            <Image
              alt="wikimudas logo"
              width={30}
              height={100}
              src={"/logo_slim.png"}
            />
            <h1 className="text-5xl font-extrabold tracking-tight text-secondary-foreground sm:text-[5rem]">
              Wiki<span className="text-primary">Mudas</span>
            </h1>
          </div>
          <Link href={"https://oama.eco.br"}>
            <h2 className="bold text-md font-extrabold text-black">por OAMa</h2>
          </Link>
        </div>
        {process.env.NEXT_PUBLIC_MAINTENANCE === "true" ? (
          <Maintanance />
        ) : (
          <LoadedSpeciesSearch speciesList={speciesList} />
        )}
      </div>
    </main>
  );
}
