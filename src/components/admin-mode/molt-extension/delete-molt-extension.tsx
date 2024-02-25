"use client";

import DeleteButton from "@/components/ui/delete-button";
import { speciesMoltExtensions, moltLimits } from "@/server/db/schema";
import { moltExtensionEnumTranslation } from "@/translations/translation";
import { api } from "@/trpc/react";
import AddMoltLimit from "../molt-limits/add-molt-limits";
import DeleteMoltLimits from "../molt-limits/delete-molt-limits";

type CompleteMoltExtesion = typeof speciesMoltExtensions.$inferSelect & {
  moltLimits: (typeof moltLimits.$inferSelect)[] | [];
};

export default function DeleteMoltExtension({
  moltExtensions,
  refetch,
}: {
  moltExtensions: CompleteMoltExtesion[] | undefined;
  refetch: () => void;
}) {
  const deleteStrategy =
    api.speciesInfo.deleteSpeciesMoltExtension.useMutation();

  return (
    <div className="flex flex-col gap-4">
      {moltExtensions?.map((extension) => (
        <div key={extension.id}>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">{`${extension.moltType}: ${
              moltExtensionEnumTranslation[extension.extension!]
            }`}</p>
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
          {extension.moltLimits.length > 0 && (
            <div className="flex flex-col gap-4">
              <DeleteMoltLimits
                moltLimits={extension.moltLimits}
                refetch={refetch}
              />
            </div>
          )}
          {extension.extension === "complete" && "no molt limit"}
          {extension.extension !== "complete" && (
            <AddMoltLimit
              speciesMoltExtensionId={extension.id}
              refetch={refetch}
            />
          )}
        </div>
      ))}
    </div>
  );
}
