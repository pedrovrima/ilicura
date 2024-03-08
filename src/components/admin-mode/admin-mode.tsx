"use client";

import AdminMoltStrategy from "./molt-strategy";
import AdminMoltExtension from "./molt-extension";
import AdminSkull from "./skull";
import AdminSexualDimorphism from "./sexual-dimorphism";
import FeaturePictures from "./feature-pictures";

import Link from "next/link";
import AdminBandSize from "./band-size";

export const AdminMode = ({ id }: { id: number }) => {
  return (
    <div className="flex w-[600px] flex-col gap-24">
      <FeaturePictures speciesId={id} />
      <AdminBandSize speciesId={id} />
      <AdminSkull speciesId={id} />
      <AdminSexualDimorphism speciesId={id} />
      <AdminMoltStrategy speciesId={id} />
      <AdminMoltExtension speciesId={id} />
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
