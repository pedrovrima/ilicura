"use client";

import DeletePill from "@/components/ui/delete-pill";
import { moltLimits as sppMoltLimits } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteMoltLimits({
  moltLimits,
  refetch,
}: {
  moltLimits: (typeof sppMoltLimits.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteMoltLimits = api.speciesInfo.deleteMoltLimits.useMutation();

  return (
    <div className="my-2  flex flex-wrap items-center gap-2">
      <p>Molt Limits:</p>
      {moltLimits?.map((ml) => (
        <DeletePill
          key={ml.id}
          isLoading={deleteMoltLimits.isLoading}
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
        >
          {ml.limit}
        </DeletePill>
      ))}
    </div>
  );
}
