import { api } from "@/trpc/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-buttons";

export default function AddHummingbirdBandCircumference({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [bandCircumference, setBandCircumference] = useState<string>();

  const addHummingbirdBandCircumference =
    api.speciesInfo.addHummingbirdBandCircumference.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!bandCircumference) return;
        addHummingbirdBandCircumference.mutate(
          { speciesId, bandCircumference },
          {
            onSuccess: () => {
              setBandCircumference(undefined);
              refetch();
            },
          },
        );
      }}
      className="flex flex-row items-center gap-2"
    >
      <Input
        value={bandCircumference || ""}
        onChange={(e) => setBandCircumference(e.target.value)}
        placeholder="Circunferência da anilha (mm)"
        className="w-48"
        required
      />
      <SubmitButton isLoading={addHummingbirdBandCircumference.isLoading} />
    </form>
  );
}
