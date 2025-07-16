"use client";

import { api } from "@/trpc/react";
import AddHummingbirdBillCorrugation from "./add-hummingbird-bill-corrugation";
import HummingbirdBillCorrugationList from "./hummingbird-bill-corrugation-list";

export default function HummingbirdBillCorrugation({
  speciesId,
}: {
  speciesId: number;
}) {
  const billCorrugationQuery =
    api.speciesInfo.getHummingbirdBillCorrugation.useQuery({
      speciesId,
    });

  if (billCorrugationQuery.isLoading) return "Loading...";
  if (billCorrugationQuery.error) return "Error";

  return (
    <div>
      <h2 className="mb-8 text-xl font-bold">
        Corrugação do Bico (beija-flores)
      </h2>

      <div className="flex flex-col gap-4">
        <AddHummingbirdBillCorrugation
          speciesId={speciesId}
          refetch={billCorrugationQuery.refetch}
        />
        <HummingbirdBillCorrugationList
          speciesId={speciesId}
          refetch={billCorrugationQuery.refetch}
        />
      </div>
    </div>
  );
}
