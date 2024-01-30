"use client";

import AdminMoltStrategy from "./molt-strategy";
import AdminMoltExtension from "./molt-extension";
import AdminSkull from "./skull";

export const AdminMode = ({ id }: { id: number }) => {
  return (
    <div className="flex w-[400px] flex-col gap-24">
      <AdminSkull speciesId={id} />
      <AdminMoltStrategy speciesId={id} />
      <AdminMoltExtension speciesId={id} />
    </div>
  );
};
