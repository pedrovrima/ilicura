"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { species } from "@/server/db/schema";

type SpeciesList = typeof species.$inferSelect;

function LoadedSpeciesSearch({ speciesList }: { speciesList: SpeciesList[] }) {
  const [searchValue, setSearchValue] = useState("" as string);
  const [searchResults, setSearchResults] = useState([] as typeof speciesList);

  useEffect(() => {
    if (searchValue.length > 4) {
      const results = speciesList.filter(
        (species) =>
          species?.ptName?.toLowerCase().includes(searchValue.toLowerCase()) ??
          species?.scientificName
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ??
          species?.sciCode?.toLowerCase().includes(searchValue.toLowerCase()) ??
          species?.enName?.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchValue, speciesList]);

  return (
    <div>
      <h1>Busca</h1>
      <Input
        value={searchValue}
        className="w-[600px] max-w-[90vw]"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchResults.length > 0 && (
        <div className="bg-white   text-black">
          <ul>
            {searchResults?.map((species) => (
              <Link key={species.id} href={`/species/${species.id}`}>
                <li
                  className=" px-4 py-2

                 hover:bg-slate-400 hover:text-white"
                >
                  {`${species.ptName}: `}
                  <span className="italic">{species.scientificName}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LoadedSpeciesSearch;
