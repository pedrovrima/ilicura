"use client";

import DeleteButton from "@/components/ui/delete-button";
import { speciesMoltExtensions as sppMoltExtensions } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteMoltExtension({
  moltExtensions,
  refetch,
}: {
  moltExtensions: (typeof sppMoltExtensions.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteStrategy =
    api.speciesInfo.deleteSpeciesMoltExtension.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {moltExtensions?.map((extension) => (
        <div key={extension.id} className="flex items-center justify-between">
          <p>{`${extension.moltType}: ${extension.extension}`}</p>
          <DeleteButton
            onClick={() =>
              deleteStrategy.mutate(
                { id: extension.id },
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
