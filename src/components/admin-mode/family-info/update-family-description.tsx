import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function UpdateFamilyDescription({
  familyDescription: initialFamilyDescription,
  familyId,
  refetch,
}: {
  familyDescription: string;
  refetch: () => void;
  familyId: number;
}) {
  const [familyDescription, setFamilyDescription] = useState(
    initialFamilyDescription,
  );
  const updateFamilyDescription =
    api.speciesInfo.updateFamilyDescription.useMutation();
  return (
    <div>
      <h3 className="text-md font-bold">Descrição:</h3>
      <div className="rounded-md border bg-gray-100 px-2 py-1">
        <p className="font-bold">Descrição atual:</p>
        {initialFamilyDescription}
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          disabled={updateFamilyDescription.isPending}
          value={familyDescription}
          onChange={(e) => setFamilyDescription(e.target.value)}
          placeholder="Digite a descrição da família..."
          className="min-h-[120px]"
        />
        <Button
          onClick={() => {
            updateFamilyDescription.mutate(
              {
                familyId,
                description: familyDescription,
              },
              {
                onSuccess: () => {
                  refetch();
                },
              },
            );
          }}
          disabled={updateFamilyDescription.isPending}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
