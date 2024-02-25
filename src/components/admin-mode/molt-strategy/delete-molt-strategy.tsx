"use client";

import DeleteButton from "@/components/ui/delete-button";
import DeletePill from "@/components/ui/delete-pill";
import { moltStrategies as strategiesType } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteMoltStrategy({
  moltStrategies,
  refetch,
}: {
  moltStrategies: (typeof strategiesType.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteStrategy = api.speciesInfo.deleteSpeciesStrategy.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {moltStrategies?.map((strategy) => (
        <div key={strategy.id} className="flex items-center justify-between">
          <DeletePill
            onClick={() =>
              deleteStrategy.mutate(
                { id: strategy.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              )
            }
            isLoading={deleteStrategy.isLoading}
          >
            {strategy.strategy}
          </DeletePill>
        </div>
      ))}
    </div>
  );
}
