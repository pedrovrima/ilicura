"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import SubmitButton from "@/components/ui/submit-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { skullClosesEnum } from "@/server/db/schema";
import { skullEnumTranslation } from "@/translations/translation";

type skullClosesEnum = (typeof skullClosesEnum.enumValues)[number];

type skullDataType = {
  closes: skullClosesEnum | undefined;
  notes: string | undefined;
};

export default function AddSkull({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [skullData, setSkullData] = useState<skullDataType>({
    notes: undefined,
    closes: undefined,
  }); // Set initial value to an empty string

  const addSkull = api.speciesInfo.addSpeciesSkullInfo.useMutation();

  const setSkullCloses = (value: skullClosesEnum) => {
    setSkullData((sk) => ({
      ...sk,
      closes: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (skullData.closes === undefined) return; // If the value is an empty string, return early
        addSkull.mutate(
          { speciesId, notes: skullData.notes ?? "", closes: skullData.closes },
          {
            onSuccess: () => {
              setSkullData({ notes: "", closes: undefined });
              refetch();
            },
          },
        );
      }}
      className="flex flex-col gap-2"
    >
      <Select
        onValueChange={(value) => setSkullCloses(value as skullClosesEnum)} // Cast the value to the correct type
        value={skullData.closes}
        required
      >
        <SelectTrigger className="bg-black">
          <SelectValue placeholder="Crânio fecha?" />
        </SelectTrigger>
        <SelectContent>
          {skullClosesEnum.enumValues.map((value) => (
            <SelectItem key={value} value={value}>
              {skullEnumTranslation[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Textarea
        className="bg-white text-black"
        value={skullData.notes}
        onChange={(e) =>
          setSkullData((sk) => ({ ...sk, notes: e.target.value }))
        }
        placeholder="Notas"
      />

      <SubmitButton isLoading={addSkull.isLoading} />
    </form>
  );
}
