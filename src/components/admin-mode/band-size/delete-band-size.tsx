import DeleteButton from "@/components/ui/delete-button";
import { api } from "@/trpc/react";
import { cemaveBandSize } from "@/server/db/schema";
import DeletePill from "@/components/ui/delete-pill";

export default function DeleteBandSize({
  bandSizeData,
  refetch,
}: {
  bandSizeData: (typeof cemaveBandSize.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteBandSize = api.speciesInfo.deleteBandSize.useMutation();
  return (
    <div>
      {bandSizeData?.map((size) => (
        <div key={size.id} className="flex items-center justify-between">
          <DeletePill
            onClick={() => {
              deleteBandSize.mutate(
                { id: size.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              );
            }}
            isLoading={deleteBandSize.isLoading}
          >
            {size.bandSize}
          </DeletePill>
        </div>
      ))}
    </div>
  );
}
