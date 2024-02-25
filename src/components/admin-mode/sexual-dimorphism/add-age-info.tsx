"use client";

import { useState } from "react";
import { ArrowUpToLine, Loader } from "lucide-react";

import { api } from "@/trpc/react";
import { agesEnum } from "@/server/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/ui/submit-buttons";

type agesType = (typeof agesEnum.enumValues)[number];

type sexualDimorphismType = {
  age: agesType | "";
  sexualDimorphism: boolean | undefined;
};

export default function AddSexualDimorphism({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [sexualDimorphism, setSexualDimorphism] =
    useState<sexualDimorphismType>({
      age: "",
      sexualDimorphism: undefined,
    });

  const createPost = api.speciesInfo.addAgeInfo.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !sexualDimorphism.age ||
          sexualDimorphism.sexualDimorphism === undefined
        )
          return; // If the value is an empty string, return early
        createPost.mutate(
          {
            speciesId,
            age: sexualDimorphism.age,
            sexualDimorphism: sexualDimorphism.sexualDimorphism,
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
          setSexualDimorphism((sd) => ({
            ...sd,
            age: value as agesType,
          }));
        }}
        value={sexualDimorphism.age}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={"Selecione a idade"}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          {agesEnum.enumValues.map((age) => (
            <SelectItem key={age} value={age}>
              {age}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => {
          setSexualDimorphism((sd) => ({
            ...sd,
            sexualDimorphism: value === "true",
          }));
        }}
        value={`${sexualDimorphism.sexualDimorphism}`}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={"Tem dimorfismo?"}></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"true"}>Sim </SelectItem>
          <SelectItem value={"false"}>Não</SelectItem>
        </SelectContent>
      </Select>
      <SubmitButton isLoading={createPost.isLoading} />
    </form>
  );
}
