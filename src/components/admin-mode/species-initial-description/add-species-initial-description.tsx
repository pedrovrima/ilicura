"use client";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/ui/submit-buttons";

export default function AddSpeciesInitialDescription({
  speciesId,
  refetch,
  existingDescription,
}: {
  speciesId: number;
  refetch: () => void;
  existingDescription?: { id: number; description: string | null } | null;
}) {
  const [description, setDescription] = useState<string>("");

  const addDescription =
    api.speciesInfo.addSpeciesInitialDescription.useMutation();
  const updateDescription =
    api.speciesInfo.updateSpeciesInitialDescription.useMutation();

  useEffect(() => {
    if (existingDescription && existingDescription.description) {
      setDescription(existingDescription.description);
    }
  }, [existingDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    if (existingDescription) {
      updateDescription.mutate(
        { id: existingDescription.id, description: description.trim() },
        {
          onSuccess: () => {
            refetch();
          },
        },
      );
    } else {
      addDescription.mutate(
        { speciesId, description: description.trim() },
        {
          onSuccess: () => {
            setDescription("");
            refetch();
          },
        },
      );
    }
  };

  const isLoading = addDescription.isLoading || updateDescription.isLoading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {existingDescription ? "Editar notas" : "Adicionar notas"}
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a notas da espécie..."
          className="min-h-[120px]"
          required
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton isLoading={isLoading}>
          {existingDescription ? "Atualizar" : "Adicionar"}
        </SubmitButton>
      </div>
    </form>
  );
}
