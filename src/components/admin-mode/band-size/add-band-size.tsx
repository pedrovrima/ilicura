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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [isSecondary, setIsSecondary] = useState<boolean>(false);
  const addBandSize = api.speciesInfo.addBandSize.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!bandSize) return; // If the value is an empty string, return early
        addBandSize.mutate(
          { speciesId, bandSize, isSecondary },
          {
            onSuccess: () => {
              refetch();
            },
          },
        );
      }}
      className="flex flex-row items-center gap-2"
    >
      <Select
        onValueChange={(value) => setBandSize(value as bandSizeEnumType)} // Cast the value to the correct type
        defaultValue={bandSize}
        required
      >
        <SelectTrigger>
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
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          checked={isSecondary}
          onCheckedChange={(checked) => setIsSecondary(checked as boolean)}
          id="is-secondary"
          className="bg-white text-black"
        />
        <p>Incomum?</p>
      </div>
      <SubmitButton isLoading={addBandSize.isLoading} />
    </form>
  );
}
