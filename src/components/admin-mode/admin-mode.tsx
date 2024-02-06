"use client";

import AdminMoltStrategy from "./molt-strategy";
import AdminMoltExtension from "./molt-extension";
import AdminSkull from "./skull";
import AdminSexualDimorphism from "./sexual-dimorphism";
import AdminPictures from "./pictures";
import AdminMoltLimit from "./molt-limits";

export const AdminMode = ({ id }: { id: number }) => {
  return (
    <div className="flex w-[400px] flex-col gap-24">
      <AdminMoltLimit speciesId={id} />
      <AdminPictures speciesId={id} />
      <AdminSkull speciesId={id} />
      <AdminSexualDimorphism speciesId={id} />
      <AdminMoltStrategy speciesId={id} />
      <AdminMoltExtension speciesId={id} />
    </div>
  );
};
