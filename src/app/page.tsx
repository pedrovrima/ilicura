import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.species.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#65590c] to-[#272c15] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Wiki<span className="text-[hsl(50,100%,70%)]">Mudas</span>
        </h1>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.species.getAll.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost.length > 0 ? (
        latestPost.map((post) => (
          <div key={post.id} className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">{post.scientificName}</h3>
          </div>
        ))
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}
