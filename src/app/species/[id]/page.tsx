import AddMoltStrategy from "@/app/_components/add-molt-strategy";
import AddMoltExtension from "@/app/_components/add-molt-extension";
import { api } from "@/trpc/server";
import { moltStrategies } from "@/server/db/schema";
import DeleteMoltStrategy from "@/app/_components/delete-molt-strategy";

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

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
            {speciesData.moltStrategies?.map((strategy, i) => (
              <span key={strategy?.id}>
                {i > 0 && " / "}
                {strategy?.strategy}
              </span>
            ))}
          </p>
        </div>
      </div>
      {speciesData.moltStrategies && (
        <DeleteMoltStrategy
          speciesId={id}
          moltStrategies={speciesData.moltStrategies}
        />
      )}
      <AddMoltStrategy speciesId={id} />
      <AddMoltExtension speciesId={id} />
    </main>
  );
}
