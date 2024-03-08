import { Carousel } from "@/components/ui/carousel";
import { api } from "@/trpc/react";

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export default function FeaturePictures({ speciesId }: { speciesId: number }) {
  const { isLoading, error, data } = api.speciesInfo.getPictures.useQuery({
    speciesId,
  });
  const {
    isLoading: featureLoading,
    error: featureError,
    data: featureData,
    refetch: refetchFeature,
  } = api.speciesInfo.getFeaturedPictures.useQuery({
    speciesId,
  });
  const addFeature = api.speciesInfo.addFeaturedPicture.useMutation();

  //ts-ignore
  if (isLoading || featureLoading) return <p>loading...</p>;
  //ts-ignore
  if (error ?? featureError) return <p>error</p>;
  if (!data) return <p>no pictures</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Fotos Destaque</h2>
      <div className="mb-12 flex w-full flex-row justify-center gap-12">
        <div className="flex flex-col items-center">
          <h3>Destaque</h3>
          <div className="h-[150px] w-[150px] overflow-hidden rounded-full">
            {featureData && (
              <img
                className="h-full w-full object-cover"
                src={`${featureData.find((f) => f.cover)?.url}?tr=q-25`}
              ></img>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3>SubDestaque</h3>
          <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full">
            {featureData && (
              <img
                className="h-full w-full object-cover"
                src={`${featureData.find((f) => !f.cover)?.url}?tr=q-25`}
              ></img>
            )}
          </div>
        </div>
      </div>
      <Carousel className="w-full md:min-w-[75%] md:max-w-[90vw] ">
        <CarouselContent>
          {data?.map((image) => (
            <CarouselItem
              className="flex h-[200px] w-[200px] basis-[200px] items-center justify-center overflow-hidden"
              key={image.id}
            >
              {image.url && (
                <div className="group relative overflow-hidden ">
                  <div className="t-0 absolute hidden h-full w-full bg-slate-900  opacity-40 group-hover:block" />
                  <div className="absolute hidden h-full w-full flex-col items-center justify-center gap-2 group-hover:flex ">
                    <Button
                      onClick={async () => {
                        await addFeature.mutateAsync({
                          speciesId,
                          pictureId: image.id,
                          cover: true,
                        });
                        await refetchFeature();
                      }}
                    >
                      Destaque
                    </Button>
                    <Button
                      onClick={async () => {
                        await addFeature.mutateAsync({
                          speciesId,
                          pictureId: image.id,
                          cover: false,
                        });
                        await refetchFeature();
                      }}
                    >
                      Sub-Destaque
                    </Button>
                  </div>
                  <img
                    className="h-full w-full object-cover"
                    src={`${image.url}?tr=q-25`}
                    alt={"abc"}
                  />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
