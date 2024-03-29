import { api } from "@/trpc/server";
import { AdminMode } from "@/components/admin-mode/admin-mode";

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

  if (!speciesData) return <p>no data</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
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
