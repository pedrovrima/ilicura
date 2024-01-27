"use client";

import { api } from "@/trpc/react";
import DeleteMoltStrategy from "./delete-molt-strategy";
import AddMoltStrategy from "./add-molt-strategy";

export default function AdminMoltStrategy({
  speciesId,
}: {
  speciesId: number;
}) {
  const moltStrategyQuery = api.speciesInfo.getSpeciesStrategies.useQuery({
    speciesId,
  });

  if (moltStrategyQuery.isLoading) return "Loading...";
  if (moltStrategyQuery.error) return "Error";
  if (moltStrategyQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Estratégia de Muda</h2>
        <div className="flex flex-col gap-4">
          <AddMoltStrategy
            speciesId={speciesId}
            refetch={moltStrategyQuery.refetch}
          />
          <DeleteMoltStrategy
            moltStrategies={moltStrategyQuery.data}
            refetch={moltStrategyQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
