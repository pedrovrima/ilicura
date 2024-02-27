"use client";

import DeleteButton from "@/components/ui/delete-button";
import type { CompleteAgeInfo } from "@/server/api/routers/speciesInfo";

import { api } from "@/trpc/react";
import AddSexInfo from "./add-sex-info";

export default function DeleteSexualDimorphism({
  sexualDimorphismData,
  refetch,
}: {
  sexualDimorphismData: CompleteAgeInfo[];
  refetch: () => void;
}) {
  const deleteSexualDimorphism =
    api.speciesInfo.deleteSexualDimorphism.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {sexualDimorphismData?.map((sexDim) => (
        <>
          <div key={sexDim.id} className="flex items-center justify-between">
            <p className="text-lg font-bold">{`${sexDim.age}: ${sexDim.sexualDimorphism ? "Com" : "Sem"} Dimorfismo`}</p>
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
          <AddSexInfo sexInfo={sexDim.sex} />
        </>
      ))}
    </div>
  );
}
