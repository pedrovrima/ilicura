"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { speciesPicture } from "@/server/db/schema";

export default function CarouselDialog({
  children,
  image,
}: {
  children: React.ReactNode;
  image: string;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="h-[97vh]   max-h-[97vh] w-[99vw] max-w-[97vw]  p-0   md:w-fit ">
          <div className="h-full w-full overflow-hidden">
            <img
              className="h-full w-full  object-contain"
              src={`${image}?tr=q-30`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
