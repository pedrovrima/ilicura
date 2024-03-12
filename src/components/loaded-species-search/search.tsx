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
    <div className="mb-20">
      <Input
        value={searchValue}
        className="h-12 w-[600px] max-w-[90vw] rounded-md border-2 border-secondary-foreground p-2 text-lg  font-bold shadow-lg "
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Busque por código, nome científico, etc."
      />
      {searchResults.length > 0 && (
        <div className="mt-28 flex justify-center">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {searchResults?.map((species) => (
              <Link key={species.id} href={`/species/${species.id}`}>
                <li className=" group relative flex h-64 flex-col items-center justify-end gap-4 overflow-hidden   rounded-lg border-2 border-secondary-foreground text-primary shadow-lg   hover:bg-primary hover:text-primary-foreground sm:w-48">
                  <div className="absolute h-full w-full overflow-hidden">
                    <img
                      className="h-64 w-48 origin-center object-cover transition-all duration-300 ease-in-out group-hover:h-72 "
                      src={
                        species.featuredPicture?.url
                          ? `${species.featuredPicture?.url}?tr=q-15`
                          : "/logo.png"
                      }
                    ></img>
                  </div>
                  <div className=" absolute h-full w-full bg-gradient-to-b from-transparent via-transparent to-black to-70% opacity-50 transition-all duration-300 ease-in-out group-hover:opacity-80" />
                  <div className="z-50 pb-4 text-center text-white sm:px-2">
                    <p className="mb-1  font-extrabold capitalize sm:text-lg ">
                      {species.ptName}
                    </p>
                    <p className="sm:text-md text-wrap text-sm italic">
                      {species.scientificName}
                    </p>
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
