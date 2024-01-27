"use client";

import { moltStrategies as strategiesType } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteMoltStrategy({
  speciesId,
  moltStrategies,
}: {
  speciesId: number;
  moltStrategies: (typeof strategiesType.$inferSelect)[];
}) {
  const deleteStrategy = api.speciesInfo.deleteSpeciesStrategy.useMutation();

  console.log(moltStrategies);
  return (
    <div>
      {moltStrategies?.map((strategy) => (
        <div key={strategy.id}>
          <p>{strategy?.strategy}</p>
          <button
            onClick={() =>
              deleteStrategy.mutate(
                { id: strategy.id },
                {
                  onSuccess: () => {
                    console.log("deleted ");
                  },
                },
              )
            }
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
}
