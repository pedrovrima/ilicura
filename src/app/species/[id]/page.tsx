import { api } from "@/trpc/server";
import { agesEnum, moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";
import {
  moltExtensionEnumTranslation,
  moltLimitsEnumTranslation,
  skullEnumTranslation,
} from "@/translations/translation";
import Link from "next/link";
import CarouselDialog from "@/components/carousel-dialog";
import { ArrowLeftIcon, Bird, Dna } from "lucide-react";

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

  type moltTypesType = (typeof moltTypesEnum.enumValues)[number];
  type moltExtesionsType = (typeof moltExtensionEnum.enumValues)[number];

  if (!speciesData) return <p>no data</p>;

  return (
    <>
      <main className="flex min-h-screen flex-col bg-primary-foreground text-slate-900">
        <div className="p absolute top-0 w-screen bg-secondary-foreground px-4 py-4">
          <Link href="/">
            <button>
              <ArrowLeftIcon className="h-8 w-8 text-primary" />
            </button>
          </Link>
        </div>

        <div className=" container max-w-[720px]  py-24">
          <div className="mb-24 flex flex-col gap-0 ">
            <h1 className="mb-12 w-full text-center text-5xl font-extrabold italic tracking-tight md:text-6xl ">
              {speciesData.scientificName}
            </h1>
            <div className="flex flex-row items-center gap-2">
              <Dna />
              <p className="text-xl  ">{speciesData.sciCode}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Bird />
              <p className="text-xl  ">{speciesData.sciCode}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img
                className="h-6 w-6"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg"
              />
              <p className="text-xl  ">{speciesData.ptName}</p>
            </div>

            <div className="flex w-fit flex-row items-center gap-2">
              <img
                className="h-6 w-6"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
              />
              <p className="text-xl ">{speciesData.enName}</p>
            </div>
          </div>

          <div className="mb-24  px-4 pb-4">
            <h2 className="mb-6 mt-2 w-full text-center text-3xl font-bold ">
              Informações Básicas
            </h2>
            <div className="mb-4 flex flex-col gap-8 overflow-hidden md:flex-row md:justify-between ">
              {speciesData.featuredPictures.length > 0 &&
                speciesData.featuredPictures.map((picture) => (
                  <div
                    key={picture.id}
                    className="flex w-[350px] flex-col items-center md:max-w-[55%]"
                  >
                    <div className="h-[350px]  overflow-hidden rounded-xl">
                      <img
                        className="h-full w-full  object-cover"
                        src={picture.url}
                      ></img>
                    </div>
                    <p className="font-bold">
                      {picture.age} - {picture.sex}
                    </p>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p className="text-lg">
                  <span className="font-bold">Tamanho da Anilha: </span>
                  {speciesData.bandSize.length === 0 && "Sem registros"}
                  {speciesData.bandSize?.map((size, i) => (
                    <span
                      key={size?.id}
                    >{`${i > 0 ? ", " : ""}${size?.bandSize}`}</span>
                  ))}
                </p>
              </div>

              <div>
                <p className="text-lg">
                  <span className="font-bold">Crânio: </span>
                  <span className="text-gray-600  ">
                    {speciesData.skull.length === 0 && "Sem registros"}
                    {speciesData.skull?.map((strategy) => {
                      if (strategy.closes)
                        return (
                          <span key={strategy?.id}>
                            {skullEnumTranslation[strategy.closes]} (
                            {strategy?.notes})
                          </span>
                        );
                    })}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <span className="font-bold">Estratégias de Muda: </span>
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
            </div>
          </div>

          <div className="mb-8  px-4">
            <h2 className="mb-6 mt-2 w-full text-center text-3xl font-bold ">
              Extensões de Muda
            </h2>
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
                            {extension?.moltType.replace("1", "")}:{" "}
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
                              <span key={ext.id} className="text-lg">
                                {i > 0 && ", "}
                                {
                                  moltExtensionEnumTranslation[
                                    ext?.extension as keyof typeof moltExtensionEnumTranslation
                                  ]
                                }
                              </span>
                            ))}
                        </p>
                        <p>
                          {extension.molLimits.length > 0 && (
                            <span>Molt Limits: </span>
                          )}
                          {extension.molLimits.map((limit, i) => (
                            <span key={limit.id}>
                              {i > 0 && ", "}{" "}
                              {
                                moltLimitsEnumTranslation[
                                  limit.limit as keyof typeof moltLimitsEnumTranslation
                                ]
                              }
                            </span>
                          ))}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="mb-8  px-4">
            <h2 className="mb-6 mt-2 w-full text-center text-3xl font-bold ">
              Idade e Sexo
            </h2>
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
                    <li key={age?.id} className="mb-16">
                      <div className="mb-4">
                        <h3 className=" mb-2 text-2xl font-bold">
                          {" "}
                          {age?.age}{" "}
                        </h3>

                        {age?.sex.map((sex, i) => (
                          <div className="mb-8" key={sex.id}>
                            <p className="mb-4 text-lg">
                              <span className=" font-bold">{sex.sex}</span>
                              {sex.description && (
                                <span>: {sex.description}</span>
                              )}
                            </p>
                            {sex.pictures?.length > 0 && (
                              <CarouselDialog pictures={sex.pictures} />
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
          className=" rounded-lg  border-transparent bg-transparent px-12 py-12  text-white hover:border-slate-400 hover:text-slate-400"
        >
          ADMIN
        </Link>
      </main>
    </>
  );
}
