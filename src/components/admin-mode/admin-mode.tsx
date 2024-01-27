"use client";

import AdminMoltStrategy from "./molt-strategy";
import AdminMoltExtension from "./molt-extension";

export const AdminMode = ({ id }: { id: number }) => {
  return (
    <div className="flex w-[400px] flex-col gap-24">
      <AdminMoltStrategy speciesId={id} />
      <AdminMoltExtension speciesId={id} />
    </div>
  );
};
