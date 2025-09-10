import { Carousel } from "@/components/ui/carousel";
import { api } from "@/trpc/react";

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

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
  const addFeatureCover = api.speciesInfo.addFeaturedPictureCover.useMutation();
  const deleteFeature = api.speciesInfo.deleteFeaturedPicture.useMutation();
  //ts-ignore
  if (isLoading || featureLoading) return <p>loading...</p>;
  //ts-ignore
  if (error ?? featureError) return <p>error</p>;
  if (!data) return <p>no pictures</p>;

  console.log(featureData);
  return (
    <div>
      <h2 className="text-2xl font-bold">Fotos Destaque</h2>
      <div className="mb-12 flex w-full flex-col justify-center gap-12">
        <div className="flex flex-col items-center">
          <h3>Selecionadas</h3>

          <div className="relative flex w-full  flex-row gap-4 ">
            {featureData.map((f) => (
              <div className="group relative h-[150px] w-[150px] overflow-hidden">
                <div className="absolute right-0 top-0 z-50">
                  <StarIcon
                    fill={f.cover ? "yellow" : "none"}
                    className="h-6 w-6"
                  />
                </div>
                <div className="absolute hidden h-full w-full flex-col items-center justify-center gap-2 group-hover:flex ">
                  <Button
                    onClick={async () => {
                      await addFeatureCover.mutateAsync({
                        speciesId,
                        pictureId: f.pictureId,
                        cover: true,
                      });
                      await refetchFeature();
                    }}
                  >
                    Destaque
                  </Button>

                  <Button
                    onClick={async () => {
                      await deleteFeature.mutateAsync({
                        id: f.id,
                        speciesId,
                      });
                      await refetchFeature();
                    }}
                  >
                    Remover
                  </Button>
                </div>
                <img
                  className="h-full w-full object-cover"
                  src={`${f.url}?tr=q-5`}
                ></img>
              </div>
            ))}
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
                            cover: false,
                          });
                          await refetchFeature();
                        }}
                      >
                        Destaque
                      </Button>
                    </div>
                    <img
                      className="h-full w-full object-cover"
                      src={`${image.url}?tr=q-5`}
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
    </div>
  );
}
