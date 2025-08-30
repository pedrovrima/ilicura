"use client";

import { api } from "@/trpc/react";
import AddSexualDimorphism from "./add-age-info";
import DeleteSexualDimorphism from "./delete-age-info";

export default function AdminSexualDimorphism({
  speciesId,
}: {
  speciesId: number;
}) {
  const sexualDimorphism = api.speciesInfo.getSexualDimorphism.useQuery({
    speciesId,
  });

  if (sexualDimorphism.isLoading) return "Loading...";
  if (sexualDimorphism.error) return "Error";
  if (sexualDimorphism.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">Informações de Idade e Sexo</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Selecione uma idade e se tem ou não dimorfismo sexual. Um novo campo
          aparecerá para adicionar uma descrição da idade/sexo e adicionar
          imagens.
        </p>
        <div className="flex flex-col gap-4">
          <AddSexualDimorphism
            speciesId={speciesId}
            refetch={sexualDimorphism.refetch}
          />
          <DeleteSexualDimorphism
            sexualDimorphismData={sexualDimorphism.data}
            refetch={sexualDimorphism.refetch}
          />
        </div>
      </div>
    );
  }
}
