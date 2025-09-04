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
import PWAImage from "../pwa-image";

export default function CarouselDialog({
  pictures,
}: {
  pictures: (typeof speciesPicture.$inferSelect)[];
}) {
  const [image, setImage] = useState("");
  return (
    <div className="flex w-full items-center justify-center">
      <Dialog>
        <Carousel className="w-[60vw] md:w-[80%] ">
          <CarouselContent className="gap-2">
            {pictures?.map((image) => (
              <CarouselItem
                className="flex h-[300px] w-[200px] basis-[200px] items-center justify-center overflow-hidden"
                key={image?.id}
              >
                {image?.url && (
                  <DialogTrigger
                    className=" h-[300px] 
                  w-[200px] overflow-hidden rounded-lg

                  "
                    onClick={() => setImage(image.url ?? "")}
                  >
                    <PWAImage
                      className="h-full w-full object-cover"
                      src={`${image.url}?tr=q-5`}
                      alt={"abc"}
                    />
                  </DialogTrigger>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DialogContent className="h-fit max-h-[90vh] w-[700px] max-w-[97vw]   p-0 ">
          <div className="h-full w-full overflow-hidden">
            <img
              className="h-full w-full  object-contain"
              src={`${image}?tr=q-5`}
              alt={"abc"}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
