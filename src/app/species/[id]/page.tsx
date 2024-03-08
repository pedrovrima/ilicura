import { api } from "@/trpc/server";
import { agesEnum, moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";
import { skullEnumTranslation } from "@/translations/translation";
import Link from "next/link";
import CarouselDialog from "@/components/carousel-dialog";

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
        <div className="container w-full py-12">
          <div className="flex flex-col gap-0">
            <h1 className="text-5xl font-extrabold italic tracking-tight ">
              {speciesData.scientificName}
            </h1>
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
          <div className="mb-8 mt-8 w-fit">
            {speciesData.featuredPictures.length > 0 &&
              speciesData.featuredPictures.map((picture) => (
                <div key={picture.id} className="flex flex-col items-center ">
                  <div className="h-96 w-96 overflow-hidden rounded-xl">
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

          <div className="mb-8">
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
          className=" rounded-lg border-2 border-transparent bg-transparent px-12 py-12  text-white hover:border-slate-400 hover:text-slate-400"
        >
          ADMIN
        </Link>
      </main>
    </>
  );
}
