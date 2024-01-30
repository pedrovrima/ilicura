import { api } from "@/trpc/server";
import { moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

  type moltTypesType = (typeof moltTypesEnum.enumValues)[number];

  if (!speciesData) return <p>no data</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#65590c] to-[#272c15] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold italic tracking-tight ">
            {speciesData.scientificName}
          </h1>
          <p className="text-xl  ">{speciesData.ptName}</p>
          <p className="text-xl ">{speciesData.enName}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Molt Strategies</h2>
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
                .map((extension, i) => (
                  <li key={extension?.moltType}>
                    {extension?.moltType}:{" "}
                    {extension?.extensions.map((ext, i) => (
                      <span key={ext.id}>
                        {i > 0 && ", "}
                        {ext.extension}
                      </span>
                    ))}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
