"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { sexEnum, speciesSexInfo } from "@/server/db/schema";
import SubmitButton from "@/components/ui/submit-buttons";
import { Textarea } from "@/components/ui/textarea";
import AddPicture from "../pictures";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageKit from "imagekit";
import { Loader } from "lucide-react";

export default function AddSexInfo({
  sexInfo,
}: {
  sexInfo: (typeof speciesSexInfo.$inferSelect)[];
}) {
  const [sexInfoText, setSexInfoText] = useState<
    {
      id: number | null;
      description: string | null;
    }[]
  >(
    sexInfo.map((s) => ({
      id: s.id,
      description: s.description,
    })),
  );

  const updateSexFormInfo = (id: number) => (description: string) => {
    setSexInfoText((info) => {
      const other = info.filter((inf) => inf.id !== id);
      return [...other, { id, description }];
    });
  };

  return sexInfo.map((sex) => (
    <SexInfo
      key={sex.id}
      sex={sex}
      updateFormInfo={updateSexFormInfo}
      sexInfoText={sexInfoText}
    />
  ));
}

const DisplayImages = ({
  images,
}: {
  images: {
    isLoading: boolean;
    error: any;
    data:
      | {
          id: number;
          fileId: string | null;
          url: string;
        }[]
      | [];
    refetch: () => void;
  };
}) => {
  if (images.isLoading) return "Loading...";
  if (images.error) return "Error";

  return (
    <div>
      {images?.data?.length > 0 && (
        <Carousel>
          <CarouselContent>
            {images.data?.map((image) => (
              <CarouselItem className="basis-32" key={image.id}>
                {image.url && (
                  <ImageDelete
                    refetch={images.refetch}
                    image={{
                      id: image.id,
                      fileId: image.fileId ?? "",
                      url: image.url,
                    }}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

const ImageDelete = ({
  refetch,
  image,
}: {
  refetch: () => void;
  image: {
    id: number;
    fileId: string;
    url: string;
  };
}) => {
  const deleteImage = api.speciesInfo.deleteSexImage.useMutation();

  return (
    <div className="group relative">
      <Image
        src={`${image.url}?tr=w-200,h-200,fo-auto`}
        alt={"abc"}
        width={200}
        height={200}
      />
      <div
        className={`absolute top-0 z-50  h-full w-full bg-primary-foreground opacity-90		  group-hover:block  ${deleteImage.isLoading ? "block" : "hidden"}`}
      />
      {deleteImage.isLoading && (
        <div className="absolute top-0 z-50 flex h-full w-full items-center justify-center">
          <Loader
            size={32}
            className="
          animate-spin-slow
          "
          />
        </div>
      )}

      {!deleteImage.isLoading && (
        <button
          onClick={async () => {
            await deleteImage.mutateAsync({
              id: image.id,
              fileId: image.fileId,
            });
            refetch();
          }}
          className="absolute top-0 z-50 hidden h-full w-full  text-lg font-bold 	text-destructive		  group-hover:block"
        >
          Deletar
        </button>
      )}
    </div>
  );
};

const SexInfo = ({
  sex,
  updateFormInfo,
  sexInfoText,
}: {
  sex: typeof speciesSexInfo.$inferSelect;
  updateFormInfo: (id: number) => (description: string) => void;
  sexInfoText: {
    id: number | null;
    description: string | null;
  }[];
}) => {
  const updateSexInfo = api.speciesInfo.updateSexInfo.useMutation();
  const images = api.speciesInfo.getSexImages.useQuery({ sexId: sex.id });

  return (
    <div key={sex.id}>
      <h3 className="text-md font-bold">Sexo: {sex.sex}</h3>
      <DisplayImages
        images={{
          isLoading: images.isLoading,
          error: images.error,
          // @ts-expect-error
          data: images.data || [],
          refetch: images.refetch,
        }}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const thisInfo = sexInfoText.find((s) => s.id === sex.id);
          if (!thisInfo) return;
          if (thisInfo.id && thisInfo.description) {
            updateSexInfo.mutate(
              thisInfo as { id: number; description: string },
            );
          }
        }}
        className="flex flex-col gap-2"
      >
        <h3 className="text-md ">Descrição:</h3>

        <Textarea
          value={sexInfoText.find((s) => s.id === sex.id)?.description ?? ""}
          onChange={(e) => {
            updateFormInfo(sex.id)(e.target.value);
          }}
        />

        <SubmitButton isLoading={updateSexInfo.isLoading}>Salvar</SubmitButton>
        <AddPicture sexId={sex.id} refetchImages={images.refetch} />
      </form>
    </div>
  );
};
