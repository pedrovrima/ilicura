"use client";

import { api } from "@/trpc/react";
import AddSkull from "./add-skull";
import DeleteSkull from "./delete-skull";

export default function AdminSkull({ speciesId }: { speciesId: number }) {
  const skullQuery = api.speciesInfo.getSkullInfo.useQuery({
    speciesId,
  });
  if (skullQuery.isLoading) return "Loading...";
  if (skullQuery.error) return "Error";
  if (skullQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Extensões das Mudas</h2>

        <div className="flex flex-col gap-4">
          <AddSkull speciesId={speciesId} refetch={skullQuery.refetch} />
          <DeleteSkull
            skullData={skullQuery.data}
            refetch={skullQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
