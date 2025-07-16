"use client";

import { api } from "@/trpc/react";
import AddHummingbirdBandCircumference from "./add-hummingbird-band-circumference";
import DeleteHummingbirdBandCircumference from "./delete-hummingbird-band-circumference";

export default function AdminHummingbirdBandCircumference({
  speciesId,
}: {
  speciesId: number;
}) {
  const bandCircumferenceQuery =
    api.speciesInfo.getHummingbirdBandCircumference.useQuery({
      speciesId,
    });
  if (bandCircumferenceQuery.isLoading) return "Loading...";
  if (bandCircumferenceQuery.error) return "Error";
  if (bandCircumferenceQuery.data) {
    return (
      <div>
        <h2 className="mb-8 text-xl font-bold">
          Circunferência da anilha (beija-flores)
        </h2>

        <div className="flex flex-col gap-4">
          <AddHummingbirdBandCircumference
            speciesId={speciesId}
            refetch={bandCircumferenceQuery.refetch}
          />
          <DeleteHummingbirdBandCircumference
            bandCircumferenceData={bandCircumferenceQuery.data}
            refetch={bandCircumferenceQuery.refetch}
          />
        </div>
      </div>
    );
  }
}
