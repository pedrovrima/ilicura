import DeleteButton from "@/components/ui/delete-button";
import { api } from "@/trpc/react";
import { hummingBirdBandCircumference } from "@/server/db/schema";
import DeletePill from "@/components/ui/delete-pill";

export default function DeleteHummingbirdBandCircumference({
  bandCircumferenceData,
  refetch,
}: {
  bandCircumferenceData: (typeof hummingBirdBandCircumference.$inferSelect)[];
  refetch: () => void;
}) {
  const deleteHummingbirdBandCircumference =
    api.speciesInfo.deleteHummingbirdBandCircumference.useMutation();
  return (
    <div>
      {bandCircumferenceData?.map((circumference) => (
        <div
          key={circumference.id}
          className="flex items-center justify-between"
        >
          <DeletePill
            onClick={() => {
              deleteHummingbirdBandCircumference.mutate(
                { id: circumference.id },
                {
                  onSuccess: () => {
                    refetch();
                  },
                },
              );
            }}
            isLoading={deleteHummingbirdBandCircumference.isLoading}
          >
            {circumference.bandCircumference} mm
          </DeletePill>
        </div>
      ))}
    </div>
  );
}
