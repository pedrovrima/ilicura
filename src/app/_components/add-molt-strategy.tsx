"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/trpc/react";
import { moltStrategiesEnum } from "@/server/db/schema";

export default function AddMoltStrategy({ speciesId }: { speciesId: number }) {
  const router = useRouter();
  const [strategy, setStrategy] = useState<"SBS" | "SAS" | "CBS" | "CAS" | "">(
    "",
  ); // Set initial value to an empty string

  const createPost = api.speciesInfo.addSpeciesStrategy.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (strategy === "") return; // If the value is an empty string, return early
        createPost.mutate({ speciesId, strategy });
      }}
      className="flex flex-col gap-2"
    >
      <select
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        onChange={(e) =>
          setStrategy(e.target.value as "SBS" | "SAS" | "CBS" | "CAS")
        } // Cast the value to the correct type
        value={strategy}
        required
      >
        {moltStrategiesEnum.enumValues.map((strategy) => (
          <option key={strategy} value={strategy}>
            {strategy}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
