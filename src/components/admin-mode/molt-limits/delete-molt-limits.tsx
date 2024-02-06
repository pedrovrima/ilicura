"use client";

import DeleteButton from "@/components/ui/delete-button";
import { moltLimits as sppMoltLimits } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteMoltExtension({
  moltLimits,
  refetch,
}: {
  moltLimits: (typeof sppMoltLimits.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteMoltLimits = api.speciesInfo.deleteMoltLimits.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {moltLimits?.map((ml) => (
        <div key={ml.id} className="flex items-center justify-between">
          <p>{`${ml.age}: ${ml.limit} - ${ml.notes}`}</p>
          <DeleteButton
            onClick={() =>
              deleteMoltLimits.mutate(
                { id: ml.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              )
            }
            isLoading={deleteMoltLimits.isLoading}
          />
        </div>
      ))}
    </div>
  );
}
