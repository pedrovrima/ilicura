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
import { speciesFeaturedPicture } from "@/server/db/schema";
import PWAImage from "../pwa-image";

export default function CarouselDialog({ pictures }: { pictures: any }) {
  const [image, setImage] = useState("");

  return (
    <div className="flex w-full items-center justify-center">
      <Dialog>
        <Carousel className="w-full items-center justify-center md:w-[60vw] ">
          <CarouselContent className="gap-2">
            {pictures?.map((image: any) => (
              <CarouselItem
                className="flex  w-full max-w-[500px] items-center justify-center overflow-hidden"
                key={image?.id}
              >
                {image?.url && (
                  <DialogTrigger
                    className=" max-w-1/2 
                    h-[500px] w-full min-w-[200px] overflow-hidden rounded-lg
                  "
                    onClick={() => setImage(image.url ?? "")}
                  >
                    <div className="relative h-full overflow-hidden">
                      <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-black to-transparent " />
                      <PWAImage
                        className="h-full w-full object-cover"
                        src={`${image.url}`}
                        alt={"abc"}
                      />
                      <p className="absolute bottom-[10px] left-4 font-bold text-white">
                        {image.age} - {image.sex}
                      </p>
                    </div>
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

export const DialogCarousel = ({
  children,
  pictures,
  index = 0,
}: {
  children: React.ReactNode;
  pictures: any;
  index?: number;
}) => {
  const [image, setImage] = useState(pictures[index]);
  return (
    <div className="flex w-full items-center justify-center">
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="h-fit max-h-[90vh] w-[700px] max-w-[97vw]   p-0 ">
          <Carousel className="w-full items-center justify-center md:w-[60vw] ">
            <CarouselContent className="gap-2">
              <CarouselItem
                className="flex  w-full max-w-[500px] items-center justify-center overflow-hidden"
                key={image?.id}
              >
                {image?.url && (
                  <DialogTrigger
                    className=" max-w-1/2 
                    h-[500px] w-full min-w-[200px] overflow-hidden rounded-lg
                  "
                    onClick={() => setImage(image.url ?? "")}
                  >
                    <div className="relative h-full overflow-hidden">
                      <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-black to-transparent " />
                      <PWAImage
                        className="h-full w-full object-cover"
                        src={`${image.url}`}
                        alt={"abc"}
                      />
                      <p className="absolute bottom-[10px] left-4 font-bold text-white">
                        {image.age} - {image.sex}
                      </p>
                    </div>
                  </DialogTrigger>
                )}
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
};
