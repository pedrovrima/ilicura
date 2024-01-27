"use client";

import DeleteButton from "@/components/ui/delete-button";
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
          <p>{strategy?.strategy}</p>
          <DeleteButton
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
          />
        </div>
      ))}
    </div>
  );
}
