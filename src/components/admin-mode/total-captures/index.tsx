import { api } from "@/trpc/react";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import SubmitButton from "@/components/ui/submit-buttons";
import { Button } from "@/components/ui/button";

export default function TotalCaptures({ speciesId }: { speciesId: number }) {
  const { data, refetch: refetchQuery } =
    api.speciesInfo.getTotalCaptures.useQuery({
      speciesId,
    });

  console.log(data);

  return (
    <div>
      <h2 className="mb-8 text-xl font-bold">
        Total de Capturas: {data?.total}
      </h2>
      <TotalCapturesInput speciesId={speciesId} refetch={refetchQuery} />
    </div>
  );
}

function TotalCapturesInput({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [total, setTotal] = useState<number>(0);
  const updateTotalCaptures = api.speciesInfo.updateTotalCaptures.useMutation();
  return (
    <div>
      <Input
        type="number"
        value={total}
        onChange={(e) => setTotal(Number(e.target.value))}
      />
      <Button
        disabled={updateTotalCaptures.isLoading}
        onClick={() =>
          updateTotalCaptures.mutate(
            { speciesId, total },
            { onSuccess: () => refetch() },
          )
        }
      >
        {updateTotalCaptures.isLoading ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
