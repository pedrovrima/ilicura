"use client";

import { api } from "@/trpc/react";
import AddMoltLimits from "./add-molt-limits";
import DeleteMoltLimits from "./delete-molt-limits";

export default function AdminMoltLimit({ speciesId }: { speciesId: number }) {
  const moltLimitsQuery = api.speciesInfo.getMoltLimits.useQuery({
    speciesId,
  });
  if (moltLimitsQuery.isLoading) return "Loading...";
  if (moltLimitsQuery.error) return "Error";
  if (moltLimitsQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Limite de Muda</h2>

        <div className="flex flex-col gap-4">
          <AddMoltLimits
            speciesId={speciesId}
            refetch={moltLimitsQuery.refetch}
          />
          <DeleteMoltLimits
            moltLimits={moltLimitsQuery.data}
            refetch={moltLimitsQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
