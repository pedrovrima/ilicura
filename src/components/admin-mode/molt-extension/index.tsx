"use client";

import { moltStrategies as strategiesType } from "@/server/db/schema";
import DeleteButton from "@/components/ui/delete-button";
import { api } from "@/trpc/react";
import AddMoltExtension from "./add-molt-extension";
import DeleteMoltExtension from "./delete-molt-extension";

export default function AdminMoltExtension({
  speciesId,
}: {
  speciesId: number;
}) {
  const moltExtensionQuery =
    api.speciesInfo.getSpeciesRawMoltExtensions.useQuery({
      speciesId,
    });
  if (moltExtensionQuery.isLoading) return "Loading...";
  if (moltExtensionQuery.error) return "Error";
  if (moltExtensionQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Extensões das Mudas</h2>

        <div className="flex flex-col gap-4">
          <AddMoltExtension
            speciesId={speciesId}
            refetch={moltExtensionQuery.refetch}
          />
          <DeleteMoltExtension
            moltExtensions={moltExtensionQuery.data}
            refetch={moltExtensionQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
