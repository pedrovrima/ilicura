"use client";

import { api } from "@/trpc/react";
import AdminMoltStrategy from "./molt-strategy";
import AdminMoltExtension from "./molt-extension";
import AdminSkull from "./skull";
import AdminSexualDimorphism from "./sexual-dimorphism";
import FeaturePictures from "./feature-pictures";
import AdminHummingbirdBandCircumference from "./hummingbird-band-circumference";
import HummingbirdBillCorrugation from "./hummingbird-bill-corrugation";
import SpeciesInitialDescription from "./species-initial-description";

import Link from "next/link";
import AdminBandSize from "./band-size";
import TotalCaptures from "./total-captures";

export const AdminMode = ({ id }: { id: number }) => {
  const speciesData = api.species.getById.useQuery({ id });

  return (
    <div className="flex w-[600px] flex-col gap-24">
      <TotalCaptures speciesId={id} />

      <AdminBandSize speciesId={id} />
      {speciesData.data?.family === "Trochilidae" && (
        <AdminHummingbirdBandCircumference speciesId={id} />
      )}
      {speciesData.data?.family === "Trochilidae" && (
        <HummingbirdBillCorrugation speciesId={id} />
      )}
      <AdminSkull speciesId={id} />
      <AdminSexualDimorphism speciesId={id} />
      <AdminMoltStrategy speciesId={id} />
      <AdminMoltExtension speciesId={id} />
      <FeaturePictures speciesId={id} />
      <SpeciesInitialDescription speciesId={id} />
      <div className="flex ">
        <Link
          href={{
            pathname: `/species/${id}`,
          }}
        >
          <button className="rounded-md bg-green-700 px-4 py-2 text-white">
            Finalizar
          </button>
        </Link>
        <Link
          href={{
            pathname: "/",
          }}
        >
          <button className="rounded-md bg-black px-4 py-2 text-white">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};
