import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function HummingbirdBillCorrugationList({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const { data: billCorrugationData } =
    api.speciesInfo.getHummingbirdBillCorrugation.useQuery({
      speciesId,
    });

  const deleteBillCorrugation =
    api.speciesInfo.deleteHummingbirdBillCorrugation.useMutation();

  if (!billCorrugationData || billCorrugationData.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma corrugação do bico registrada
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Corrugação do Bico:</h3>
      <div className="flex flex-col gap-1">
        {billCorrugationData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.age}:</span>
              <span className="text-sm">{item.billCorrugation}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                deleteBillCorrugation.mutate(
                  { id: item.id },
                  {
                    onSuccess: () => {
                      refetch();
                    },
                  },
                );
              }}
              disabled={deleteBillCorrugation.isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
