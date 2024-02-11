"use client";

import { api } from "@/trpc/react";
import AddBandSize from "./add-band-size";
import DeleteBandSize from "./delete-band-size";

export default function AdminBandSize({ speciesId }: { speciesId: number }) {
  const bandSizeQuery = api.speciesInfo.getBandSize.useQuery({
    speciesId,
  });
  if (bandSizeQuery.isLoading) return "Loading...";
  if (bandSizeQuery.error) return "Error";
  if (bandSizeQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Tamanho da anilha</h2>

        <div className="flex flex-col gap-4">
          <AddBandSize speciesId={speciesId} refetch={bandSizeQuery.refetch} />
          <DeleteBandSize
            bandSizeData={bandSizeQuery.data}
            refetch={bandSizeQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
