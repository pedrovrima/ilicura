"use client";

import { api } from "@/trpc/react";
import AddSpeciesInitialDescription from "./add-species-initial-description";

export default function SpeciesInitialDescription({
  speciesId,
}: {
  speciesId: number;
}) {
  const {
    data: descriptionData,
    refetch,
    isLoading,
    error,
  } = api.speciesInfo.getSpeciesInitialDescription.useQuery({
    speciesId,
  });

  if (isLoading) return "Loading...";
  if (error) {
    return "Error " + error.message;
  }

  return (
    <div>
      <h2 className="mb-8 text-xl font-bold">Descrição Inicial da Espécie</h2>

      <div className="flex flex-col gap-6">
        <AddSpeciesInitialDescription
          speciesId={speciesId}
          refetch={refetch}
          existingDescription={descriptionData}
        />

        {descriptionData && descriptionData.description && (
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">Descrição Atual:</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {descriptionData.description}
            </p>
          </div>
        )}

        {!descriptionData && (
          <div className="rounded-md border p-4">
            <p className="text-sm text-muted-foreground">
              Nenhuma descrição inicial registrada para esta espécie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
