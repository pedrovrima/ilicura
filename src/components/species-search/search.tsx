"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import { Input } from "../ui/input";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";

export default function SpeciesSearch() {
  const [searchValue, setSearchValue] = useState("" as string);
  const search = api.species.search.useQuery(
    {
      query: searchValue,
    },
    {
      enabled: searchValue.length > 3 && !!searchValue,
    },
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-black">Species Search</h1>
      <Input
        className="h-12 w-[600px] max-w-[90vw] rounded-md border-2 border-secondary-foreground p-2  text-lg font-bold"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {(search.data ?? search.isFetching) && (
        <div className="bg-white   text-black">
          {search.isFetching ? (
            <div className="px-4 py-2 ">
              <LoaderIcon className="animate-spin-slow" size={32}></LoaderIcon>
            </div>
          ) : (
            <ul>
              {search.data?.map((species) => (
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
          )}
        </div>
      )}
    </div>
  );
}
