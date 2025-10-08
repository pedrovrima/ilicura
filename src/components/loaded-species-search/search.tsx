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
    <div className="mb-20 flex w-[90vw] max-w-[90vw] flex-col items-center">
      <Input
        value={searchValue}
        className="h-12 w-[600px] max-w-[90vw] rounded-md border-2 border-secondary-foreground p-2 text-lg  font-bold shadow-lg "
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Busque por código, nome científico, etc."
      />
      {searchResults.length > 0 && (
        <div className="mt-28 flex w-full justify-center">
          <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 ">
            {searchResults?.map((species) => (
              <Link key={species.id} href={`/species/${species.id}`}>
                <li className=" group relative flex h-[250px] w-[43vw] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg border-2 border-secondary-foreground   text-primary shadow-lg hover:bg-primary hover:text-primary-foreground    sm:w-[27vw] md:h-[400px] lg:w-[20vw] ">
                  <div className="absolute h-full w-full overflow-hidden">
                    <img
                      className="h-full w-full origin-center object-cover transition-all  duration-300 ease-in-out"
                      src={
                        species.featuredPicture?.url
                          ? `${species.featuredPicture?.url}?tr=q-5`
                          : "/no-photo.webp"
                      }
                    ></img>
                  </div>
                  <div className=" absolute h-full w-full bg-gradient-to-b from-transparent via-transparent to-black to-90%  opacity-80 transition-all duration-300 ease-in-out" />
                  <div className="z-50 pb-4 text-center text-white sm:px-2">
                    <p className="text-wrap font-cardo text-lg ">
                      {species.scientificName}
                    </p>
                    <p className="mb-1 text-sm font-extrabold ">
                      {species.ptName}
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
