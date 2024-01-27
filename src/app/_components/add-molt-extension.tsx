"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";

const moltExtensions = moltExtensionEnum.enumValues;
const moltTypes = moltTypesEnum.enumValues;

type moltExtesionsType = (typeof moltExtensions)[number];
type moltTypesType = (typeof moltTypes)[number];

export default function AddMoltExtension({ speciesId }: { speciesId: number }) {
  const [extension, setExtension] = useState<moltExtesionsType>(); // Set initial value to an empty string
  const [moltType, setMoltType] = useState<moltTypesType>();

  const addExtension = api.speciesInfo.addSpeciesMoltExtension.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!extension || !moltType) return; // If the value is an empty string, return early
        addExtension.mutate({ speciesId, extension, moltType });
      }}
      className="flex flex-col gap-2"
    >
      <select
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        onChange={(e) => setMoltType(e.target.value as moltTypesType)} // Cast the value to the correct type
        value={moltType}
        required
      >
        {moltTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        onChange={(e) => setExtension(e.target.value as moltExtesionsType)} // Cast the value to the correct type
        value={extension}
        required
      >
        {moltExtensions.map((extension) => (
          <option key={extension} value={extension}>
            {extension}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={addExtension.isLoading}
      >
        {addExtension.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
