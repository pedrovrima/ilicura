import AddMoltStrategy from "@/components/admin-mode/molt-strategy/add-molt-strategy";
import AddMoltExtension from "@/components/admin-mode/add-molt-extension";
import { api } from "@/trpc/server";
import { moltStrategies } from "@/server/db/schema";
import DeleteMoltStrategy from "@/components/admin-mode/molt-strategy/delete-molt-strategy";
import { AdminMode } from "@/components/admin-mode/admin-mode";

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
        </div>
        <AdminMode id={id} />
      </div>
    </main>
  );
}
