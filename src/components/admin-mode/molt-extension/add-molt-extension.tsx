"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";
import SubmitButton from "@/components/ui/submit-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moltExtensionEnumTranslation } from "@/translations/translation";

const moltExtensions = moltExtensionEnum.enumValues;
const moltTypes = moltTypesEnum.enumValues;

type moltExtesionsType = (typeof moltExtensions)[number];
type moltTypesType = (typeof moltTypes)[number];

export default function AddMoltExtension({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [extension, setExtension] = useState<moltExtesionsType>(); // Set initial value to an empty string
  const [moltType, setMoltType] = useState<moltTypesType>();

  const addExtension = api.speciesInfo.addSpeciesMoltExtension.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!extension ?? !moltType) return; // If the value is an empty string, return early
        if (extension && moltType)
          addExtension.mutate(
            { speciesId, extension, moltType },

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
        onValueChange={(value) => setMoltType(value as moltTypesType)} // Cast the value to the correct type
        defaultValue={moltType}
        required
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Muda" />
        </SelectTrigger>
        <SelectContent>
          {moltTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => setExtension(value as moltExtesionsType)} // Cast the value to the correct type
        defaultValue={extension}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Extensão" />
        </SelectTrigger>

        <SelectContent>
          {moltExtensions.map((extension) => (
            <SelectItem key={extension} value={extension}>
              {moltExtensionEnumTranslation[extension as moltExtesionsType]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <SubmitButton isLoading={addExtension.isLoading} />
    </form>
  );
}
