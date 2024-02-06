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
import { moltExtensionEnumTranslation } from "@/translations/translation";
import { Textarea } from "@/components/ui/textarea";

const agesEnum = _agesEnum.enumValues;
const moltLimitsEnum = _moltLimitsEnum.enumValues;

type agesType = (typeof agesEnum)[number];
type moltLimitsType = (typeof moltLimitsEnum)[number];

type moltLimitObject = {
  age: agesType | "";
  limit: moltLimitsType | "";
  notes: string | undefined;
};

export default function addMoltLimit({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [moltLimitData, setMoltLimitData] = useState<moltLimitObject>({
    age: "",
    limit: "",
    notes: undefined,
  }); // Set initial value to an empty string

  const addMoltLimit = api.speciesInfo.addMoltLimits.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!moltLimitData?.age || !moltLimitData?.limit) return; // If the value is an empty string, return early
        addMoltLimit.mutate(
          {
            speciesId,
            age: moltLimitData.age,
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
      className="flex flex-col gap-2"
    >
      <div className="flex flex-row gap-2">
        <Select
          onValueChange={(value) =>
            setMoltLimitData((moltLimitData) => ({
              ...moltLimitData,
              age: value as agesType,
            }))
          } // Cast the value to the correct type
          value={moltLimitData.age}
          required
        >
          <SelectTrigger className="bg-black">
            <SelectValue placeholder="Idade" />
          </SelectTrigger>
          <SelectContent>
            {agesEnum.map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          <SelectTrigger className="bg-black">
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
      </div>
      <Textarea
        className="bg-black"
        value={moltLimitData.notes}
        onChange={(e) =>
          setMoltLimitData((moltLimitData) => ({
            ...moltLimitData,
            notes: e.target.value,
          }))
        }
        placeholder="Notas"
      />

      <SubmitButton isLoading={addMoltLimit.isLoading} />
    </form>
  );
}
