"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { species } from "@/server/db/schema";

type SpeciesList = typeof species.$inferSelect & {
  featuredPicture:
    | {
        url: string | null;
        id: number;
        speciesId: number | null;
      }
    | undefined;
};

function LoadedSpeciesSearch({ speciesList }: { speciesList: SpeciesList[] }) {
  const [searchValue, setSearchValue] = useState("" as string);
  const [searchResults, setSearchResults] = useState(speciesList);

  useEffect(() => {
    if (searchValue.length > 1) {
      const results = speciesList.filter(
        (species) =>
          //eslint-disable-next-line
          species?.ptName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          species?.scientificName
            ?.toLowerCase()
            //eslint-disable-next-line
            .includes(searchValue.toLowerCase()) ||
          //eslint-disable-next-line
          species?.sciCode?.toLowerCase().includes(searchValue.toLowerCase()) ||
          species?.enName?.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults(speciesList);
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
        <div className="mt-12">
          <ul className="flex flex-col gap-8">
            {searchResults?.map((species) => (
              <Link key={species.id} href={`/species/${species.id}`}>
                <li className="flex flex-row items-center  gap-4 rounded-md border-[1px] border-primary bg-secondary-foreground px-4 py-2 text-primary hover:bg-primary hover:text-primary-foreground">
                  <div className="h-24 w-24 overflow-hidden rounded-full">
                    <img
                      className="h-full w-full origin-center object-cover"
                      src={species.featuredPicture?.url ?? "/logo.png"}
                    ></img>
                  </div>
                  <div>
                    <p className="font-bold capitalize">{species.ptName}</p>
                    <span className="italic">{species.scientificName}</span>
                  </div>
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
