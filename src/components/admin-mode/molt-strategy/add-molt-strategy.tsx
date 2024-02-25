"use client";

import { useState } from "react";
import { ArrowUpToLine, Loader } from "lucide-react";

import { api } from "@/trpc/react";
import { moltStrategiesEnum } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/ui/submit-buttons";

type moltStrategiesType = (typeof moltStrategiesEnum.enumValues)[number];

export default function AddMoltStrategy({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [strategy, setStrategy] = useState<moltStrategiesType | "">(""); // Set initial value to an empty string

  const createPost = api.speciesInfo.addSpeciesStrategy.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (strategy === "") return; // If the value is an empty string, return early
        createPost.mutate(
          { speciesId, strategy },
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
        onValueChange={(value) => {
          setStrategy(value as moltStrategiesType);
        }}
        defaultValue={strategy}
        required
      >
        <SelectTrigger value={strategy}>
          <SelectValue
            placeholder={"Selecione a estratégia de muda"}
          ></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {moltStrategiesEnum.enumValues.map((strategy) => (
            <SelectItem key={strategy} value={strategy}>
              {strategy}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <SubmitButton isLoading={createPost.isLoading} />
    </form>
  );
}
