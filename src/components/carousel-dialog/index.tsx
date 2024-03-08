"use client";

import React, { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { speciesPicture } from "@/server/db/schema";

export default function CarouselDialog({
  pictures,
}: {
  pictures: (typeof speciesPicture.$inferSelect)[];
}) {
  const [image, setImage] = useState("");
  return (
    <div className="flex w-full items-center justify-center">
      <Dialog>
        <Carousel className="w-[60vw] md:min-w-[75%] md:max-w-[90vw] ">
          <CarouselContent>
            {pictures?.map((image) => (
              <CarouselItem
                className="flex h-[100px] w-[100px] basis-32 items-center justify-center overflow-hidden"
                key={image.id}
              >
                {image.url && (
                  <DialogTrigger className="h-full w-full">
                    <button onClick={() => setImage(image.url ?? "")}>
                      <img
                        className="h-full w-full object-cover"
                        src={`${image.url}?tr=q-90`}
                        alt={"abc"}
                      />
                    </button>
                  </DialogTrigger>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DialogContent className="max-h-[90vh] max-w-[97vw]   p-0 ">
          <div className="h-full w-full overflow-hidden">
            <img
              className="h-full w-full  object-contain"
              src={`${image}?tr=q-90`}
              alt={"abc"}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
