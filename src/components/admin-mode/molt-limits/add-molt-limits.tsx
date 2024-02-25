"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import {
  agesEnum as _agesEnum,
  moltLimitsEnum as _moltLimitsEnum,
} from "@/server/db/schema";
import SubmitButton from "@/components/ui/submit-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

const agesEnum = _agesEnum.enumValues;
const moltLimitsEnum = _moltLimitsEnum.enumValues;

type moltLimitsType = (typeof moltLimitsEnum)[number];

type moltLimitObject = {
  limit: moltLimitsType | "";
  notes: string | undefined;
};

export default function AddMoltLimit({
  speciesMoltExtensionId,
  refetch,
}: {
  speciesMoltExtensionId: number;
  refetch: () => void;
}) {
  const [moltLimitData, setMoltLimitData] = useState<moltLimitObject>({
    limit: "",
    notes: undefined,
  }); // Set initial value to an empty string

  const addMoltLimit = api.speciesInfo.addMoltLimits.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!moltLimitData?.limit) return; // If the value is an empty string, return early
        addMoltLimit.mutate(
          {
            speciesMoltExtensionId,
            limit: moltLimitData.limit,
            notes: moltLimitData.notes ?? "",
          },
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
          setMoltLimitData((moltLimitData) => ({
            ...moltLimitData,
            limit: value as moltLimitsType,
          }));
        }}
        defaultValue={moltLimitData.limit}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo de Limite" />
        </SelectTrigger>

        <SelectContent>
          {moltLimitsEnum.map((limit) => (
            <SelectItem key={limit} value={limit}>
              {limit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <SubmitButton isLoading={addMoltLimit.isLoading} />
    </form>
  );
}
