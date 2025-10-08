import { unstable_noStore as noStore } from "next/cache";
import { api } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import LoadedSpeciesSearch from "../../components/loaded-species-search/search";

import Image from "next/image";

export default async function Home() {
  noStore();
  const speciesList = await api.species.getAllSpecies.query();

  return (
    <main className="flex h-full  flex-col  text-secondary">
      <div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden bg-black">
        <img
          src="/capa.jpg"
          alt="wikimudas logo"
          className="h-full w-full overflow-hidden object-cover object-center opacity-80 md:object-left"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f1e4ca9f] via-[#f1e4ca9f] to-transparent md:bg-gradient-to-r md:via-[#f1e4ca0f]" />
      </div>

      <div className="flex  h-screen flex-col justify-between font-b612 md:w-1/2 lg:w-1/3">
        <div className="container relative flex  h-full  flex-col items-center justify-between gap-12 px-4 pb-4 pt-16">
          <div className="container z-10  flex  flex-col items-center justify-start gap-12 px-4 pt-16">
            <div></div>
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="mb-4 flex flex-col items-end ">
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
                  <h2 className="bold text-md font-extrabold text-black">
                    por OAMa
                  </h2>
                </Link>
              </div>
              <p className="w-full max-w-3xl text-center text-black">
                Enciclopédia colaborativa de muda e idade de aves brasileiras.
              </p>
            </div>
            <div className="fle flex gap-4">
              <Link href={"/species"}>
                <Button>Explorar a plataforma</Button>
              </Link>
              <Link href={"/sobre"}>
                <Button variant="secondary">Sobre</Button>
              </Link>
            </div>
          </div>
          <div className="flex w-full flex-col  items-end justify-center gap-4 px-12">
            <p className="text-black">Apoio: </p>
            <img className="h-auto w-12" src="/logo-crbio04.webp" alt="apoio" />
          </div>
        </div>
      </div>
    </main>
  );
}
