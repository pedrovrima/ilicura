"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { moltExtensionEnum, moltTypesEnum, skull } from "@/server/db/schema";
import SubmitButton from "@/components/ui/submit-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type skullDataType = {
  closes: boolean | undefined;
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

  console.log(skullData);

  const addSkull = api.speciesInfo.addSpeciesSkullInfo.useMutation();

  const setSkullCloses = (value: string) => {
    console.log(value);
    setSkullData((sk) => ({
      ...sk,
      closes: value ? value === "true" : undefined,
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
              console.log("sucess");
              setSkullData({ notes: "", closes: undefined });
              refetch();
            },
          },
        );
      }}
      className="flex flex-col gap-2"
    >
      <Select
        onValueChange={(value) => setSkullCloses(value)} // Cast the value to the correct type
        value={
          skullData.closes === undefined ? "" : skullData.closes.toString()
        }
        required
      >
        <SelectTrigger className="bg-black">
          <SelectValue placeholder="Crânio fecha?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"true"}>Sim</SelectItem>
          <SelectItem value={"false"}>Não</SelectItem>
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
