"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { sexEnum, speciesSexInfo } from "@/server/db/schema";
import SubmitButton from "@/components/ui/submit-buttons";
import { Textarea } from "@/components/ui/textarea";

export default function AddSexInfo({
  sexInfo,
}: {
  sexInfo: (typeof speciesSexInfo.$inferSelect)[];
}) {
  console.log(sexInfo);
  const [sexInfoText, setSexInfoText] = useState<
    {
      id: number | null;
      description: string | null;
    }[]
  >(
    sexInfo.map((s) => ({
      id: s.id,
      description: s.description,
    })),
  );

  const updateSexFormInfo = (id: number) => (description: string) => {
    setSexInfoText((info) => {
      const other = info.filter((inf) => inf.id !== id);
      return [...other, { id, description }];
    });
  };

  const updateSexInfo = api.speciesInfo.updateSexInfo.useMutation();

  return sexInfo.map((sex) => (
    <div key={sex.id}>
      <h3 className="text-md font-bold">Sexo: {sex.sex}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const thisInfo = sexInfoText.find((s) => s.id === sex.id);
          if (!thisInfo) return;
          if (thisInfo.id && thisInfo.description) {
            updateSexInfo.mutate(
              thisInfo as { id: number; description: string },
            );
          }
        }}
        className="flex flex-col gap-2"
      >
        <h3 className="text-md ">Descrição:</h3>

        <Textarea
          value={sexInfoText.find((s) => s.id === sex.id)?.description ?? ""}
          onChange={(e) => {
            updateSexFormInfo(sex.id)(e.target.value);
          }}
        />
        <SubmitButton isLoading={updateSexInfo.isLoading}>Salvar</SubmitButton>
      </form>
    </div>
  ));
}
