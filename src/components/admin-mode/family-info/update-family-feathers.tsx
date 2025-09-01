import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function UpdateFamilyFeathers({
  n_primary_feathers: initialN_primary_feathers,
  n_secondary_feathers: initialN_secondary_feathers,
  familyId,
  refetch,
}: {
  n_primary_feathers: number;
  n_secondary_feathers: number;
  familyId: number;
  refetch: () => void;
}) {
  const [n_primary_feathers, setN_primary_feathers] = useState(
    initialN_primary_feathers,
  );
  const [n_secondary_feathers, setN_secondary_feathers] = useState(
    initialN_secondary_feathers,
  );
  const updateFamilyPrimaryFeathers =
    api.speciesInfo.updateFamilyPrimaryFeathers.useMutation();
  const updateFamilySecondaryFeathers =
    api.speciesInfo.updateFamilySecondaryFeathers.useMutation();
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-md font-bold">
        Número de Penas Primárias: {initialN_primary_feathers}
      </h3>
      <Input
        disabled={updateFamilyPrimaryFeathers.isPending}
        value={n_primary_feathers}
        onChange={(e) => setN_primary_feathers(Number(e.target.value))}
      />
      <Button
        onClick={() => {
          updateFamilyPrimaryFeathers.mutate(
            {
              familyId,
              n_primary_feathers: n_primary_feathers,
            },
            {
              onSuccess: () => {
                refetch();
              },
            },
          );
        }}
        disabled={updateFamilyPrimaryFeathers.isPending}
      >
        Salvar
      </Button>
      <h3 className="text-md font-bold">
        Número de Penas Secundárias: {initialN_secondary_feathers}
      </h3>
      <Input
        disabled={updateFamilySecondaryFeathers.isPending}
        value={n_secondary_feathers}
        onChange={(e) => setN_secondary_feathers(Number(e.target.value))}
      />
      <Button
        disabled={updateFamilySecondaryFeathers.isPending}
        onClick={() => {
          updateFamilySecondaryFeathers.mutate(
            {
              familyId,
              n_secondary_feathers: n_secondary_feathers,
            },
            {
              onSuccess: () => {
                refetch();
              },
            },
          );
        }}
      >
        Salvar
      </Button>
    </div>
  );
}
