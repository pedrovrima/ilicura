"use client";

import DeleteButton from "@/components/ui/delete-button";
import { sexualDimorphism } from "@/server/db/schema";
import { api } from "@/trpc/react";

export default function DeleteSexualDimorphism({
  sexualDimorphismData,
  refetch,
}: {
  sexualDimorphismData: (typeof sexualDimorphism.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteSexualDimorphism =
    api.speciesInfo.deleteSexualDimorphism.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {sexualDimorphismData?.map((sexDim) => (
        <div key={sexDim.id} className="flex items-center justify-between">
          <p>{`${sexDim.age}: ${sexDim.sexualDimorphism}`}</p>
          <DeleteButton
            onClick={() =>
              deleteSexualDimorphism.mutate(
                { id: sexDim.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              )
            }
            isLoading={deleteSexualDimorphism.isLoading}
          />
        </div>
      ))}
    </div>
  );
}
