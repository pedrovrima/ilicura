import { api } from "@/trpc/react";
import { useState } from "react";
import { bandSizeEnum } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-buttons";

type bandSizeEnumType = (typeof bandSizeEnum.enumValues)[number];

export default function AddBandSize({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [bandSize, setBandSize] = useState<bandSizeEnumType>(); // Set initial value to an empty string

  const addBandSize = api.speciesInfo.addBandSize.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!bandSize) return; // If the value is an empty string, return early
        addBandSize.mutate(
          { speciesId, bandSize },
          {
            onSuccess: () => {
              refetch();
            },
          },
        );
      }}
      className="flex flex-row gap-2"
    >
      <Select
        onValueChange={(value) => setBandSize(value as bandSizeEnumType)} // Cast the value to the correct type
        defaultValue={bandSize}
        required
      >
        <SelectTrigger className="bg-black">
          <SelectValue placeholder="Tamanho da anilha" />
        </SelectTrigger>
        <SelectContent>
          {bandSizeEnum.enumValues.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SubmitButton isLoading={addBandSize.isLoading} />
    </form>
  );
}
