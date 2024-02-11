import DeleteButton from "@/components/ui/delete-button";
import { api } from "@/trpc/react";
import { cemaveBandSize } from "@/server/db/schema";

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
          <p>{size.bandSize}</p>

          <DeleteButton
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
          />
        </div>
      ))}
    </div>
  );
}
