"use client";

import DeleteButton from "@/components/ui/delete-button";
import { skull as skullTable } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteSkull({
  skullData,
  refetch,
}: {
  skullData: (typeof skullTable.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteSkull = api.speciesInfo.deleteSpeciesSkullInfo.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {skullData?.map((skullDatum) => (
        <div key={skullDatum.id} className="flex items-center justify-between">
          <p>{`${skullDatum.closes}: ${skullDatum.notes}`}</p>
          <DeleteButton
            onClick={() =>
              deleteSkull.mutate(
                { id: skullDatum.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              )
            }
            isLoading={deleteSkull.isLoading}
          />
        </div>
      ))}
    </div>
  );
}
