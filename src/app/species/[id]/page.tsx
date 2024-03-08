import { api } from "@/trpc/server";
import {
  agesEnum,
  moltExtensionEnum,
  moltTypesEnum,
  speciesPicture,
} from "@/server/db/schema";
import { skullEnumTranslation } from "@/translations/translation";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Head from "next/head";

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

  type moltTypesType = (typeof moltTypesEnum.enumValues)[number];
  type moltExtesionsType = (typeof moltExtensionEnum.enumValues)[number];
  type agesType = (typeof agesEnum.enumValues)[number];
  type picturesType = typeof speciesPicture.$inferSelect;

  if (!speciesData) return <p>no data</p>;

  console.log(speciesData.ageInfo);
  const agesEnumValues = agesEnum.enumValues;
  const allImages = speciesData.ageInfo.reduce((acc: picturesType[], age) => {
    const ageImages = age.sex.reduce((acc: picturesType[], sex) => {
      return [...acc, ...sex.pictures];
    }, []);
    return [...acc, ...ageImages];
  }, []);

  return (
    <>
      <main className="min-h-screen max-w-[100vw] overflow-hidden  px-4 text-slate-900 md:px-12">
        <div className="container w-full  py-16 ">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold italic tracking-tight ">
              {speciesData.scientificName}
            </h1>
            <p className="text-xl  ">{speciesData.ptName}</p>
            <p className="text-xl ">{speciesData.enName}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tamanho da Anilha</h2>
            <p>
              <span className="text-gray-600  ">
                {speciesData.bandSize.length === 0 && "Sem registros"}
              </span>
            </p>
            <p>
              {speciesData.bandSize?.map((size, i) => (
                <span
                  key={size?.id}
                >{`${i > 0 ? ", " : ""}${size?.bandSize}`}</span>
              ))}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Crânio</h2>
            <p>
              <span className="text-gray-600  ">
                {speciesData.skull.length === 0 && "Sem registros"}
              </span>
            </p>
            {speciesData.skull?.map((strategy) => {
              if (strategy.closes)
                return (
                  <p key={strategy?.id}>
                    {skullEnumTranslation[strategy.closes]}: {strategy?.notes}
                  </p>
                );
            })}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Estratégias de Muda</h2>
            <p>
              <span className="text-gray-600  ">
                {speciesData.moltStrategies.length === 0 && "Sem registros"}
              </span>
              {speciesData.moltStrategies?.map((strategy, i) => (
                <span key={strategy?.id}>
                  {i > 0 && " / "}
                  {strategy?.strategy}
                </span>
              ))}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Extensões de Muda</h2>
            <div>
              {speciesData.moltExtensions.length === 0 && (
                <p className="text-gray-600  ">Sem registros</p>
              )}
              <ul>
                {speciesData.moltExtensions
                  ?.sort(
                    //sort by enum order
                    (a, b) =>
                      moltTypesEnum.enumValues.indexOf(
                        a.moltType as moltTypesType,
                      ) -
                      moltTypesEnum.enumValues.indexOf(
                        b.moltType as moltTypesType,
                      ),
                  )
                  .map((extension) => (
                    <li key={extension?.moltType}>
                      <div className="mb-4">
                        <p className="mb-0">
                          <span className="text-lg font-extrabold">
                            {" "}
                            {extension?.moltType}:{" "}
                          </span>

                          {extension?.extensions
                            .sort(
                              (a, b) =>
                                moltExtensionEnum.enumValues.indexOf(
                                  a.extension as moltExtesionsType,
                                ) -
                                moltExtensionEnum.enumValues.indexOf(
                                  b.extension as moltExtesionsType,
                                ),
                            )

                            .map((ext, i) => (
                              <span key={ext.id}>
                                {i > 0 && ", "}
                                {ext.extension}
                              </span>
                            ))}
                        </p>
                        <p>
                          {extension.molLimits.length > 0 && (
                            <span className="italic">Molt Limits: </span>
                          )}
                          {extension.molLimits.map((limit, i) => (
                            <span key={limit.id}>
                              {i > 0 && ", "} {limit.limit}
                            </span>
                          ))}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Idade e Sexo</h2>
            <div>
              {speciesData.ageInfo.length === 0 && (
                <p className="text-gray-600  ">Sem registros</p>
              )}
              <ul>
                {speciesData.ageInfo
                  ?.sort(
                    //sort by enum order
                    (a, b) =>
                      agesEnum.enumValues.indexOf(a.age!) -
                      agesEnum.enumValues.indexOf(b.age!),
                  )
                  .map((age) => (
                    <li key={age?.id}>
                      <div className="mb-4">
                        <p className="mb-0"> {age?.age}: </p>

                        {age?.sex.map((sex, i) => (
                          <div key={sex.id}>
                            <p>{sex.sex}</p>
                            <p>{sex.description}</p>
                            {sex.pictures?.length > 0 && (
                              <div className="flex w-full items-center justify-center">
                                <Carousel className="min-w-[75%] max-w-[90vw]">
                                  <CarouselContent>
                                    {sex.pictures?.map((image) => (
                                      <CarouselItem
                                        className="flex h-[100px] w-[100px] basis-32 items-center justify-center overflow-hidden"
                                        key={image.id}
                                      >
                                        {image.url && (
                                          <Dialog>
                                            <DialogTrigger className="h-full w-full">
                                              <img
                                                className="h-full w-full object-cover"
                                                src={`${image.url}?tr=q-90`}
                                                alt={"abc"}
                                              />
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[90vh] max-w-[97vw]   p-0 ">
                                              <div className="h-full w-full overflow-hidden">
                                                <img
                                                  className="h-full w-full  object-contain"
                                                  src={`${image.url}?tr=q-90`}
                                                  alt={"abc"}
                                                />
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        )}
                                      </CarouselItem>
                                    ))}
                                  </CarouselContent>
                                  <CarouselPrevious />
                                  <CarouselNext />
                                </Carousel>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <Link
          href={`/admin/species/${id}`}
          className=" rounded-lg border-2 border-transparent bg-transparent px-12 py-12  text-white hover:border-slate-400 hover:text-slate-400"
        >
          ADMIN
        </Link>
      </main>
    </>
  );
}
