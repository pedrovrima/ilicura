import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "@/trpc/react";

import ImageKit from "imagekit";
import { env } from "@/env";

type FileWithPreview = File & { preview: string };

const imagek = new ImageKit({
  publicKey: env.NEXT_PUBLIC_IMAGEK_PUBLIC_KEY,
  privateKey: env.NEXT_PUBLIC_IMAGEK_PRIVATE_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEK_URL_ENDPOINT,
});

export default function Dropzone({
  sexId,
  refetchImages,
}: {
  sexId: number;
  refetchImages: () => void;
}) {
  const addImageApi = api.speciesInfo.addSexImage.useMutation();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles((fils) => [
        ...fils,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      ]);
    },
  });

  const thumbs = files.map((file) => (
    <div className="flex flex-row" key={file.name}>
      <div className="relative mb-8 mr-8 box-border inline-flex h-[100px] w-[100px] rounded-sm border-[1px] border-[#eaeaea] p-[4px]">
        <div className="flex overflow-hidden ">
          <img
            src={file.preview}
            className="h-full w-full object-cover"
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant={"outline"}
          onClick={async () => {
            await imagek
              .upload({
                //@ts-expect-error next line
                file: file,
                fileName: file.name,
                useUniqueFileName: true,
              })
              .then(async (res) => {
                if (res.url) {
                  await addImageApi.mutateAsync({
                    sexId,
                    fileId: res.fileId,
                    url: res.url,
                    thumbnailUrl: res.thumbnailUrl,
                  });
                  setFiles((files) =>
                    files.filter((f) => f.name !== file.name),
                  );
                  refetchImages();
                }
              });
          }}
        >
          Enviar
        </Button>
        <Button
          variant={"destructive"}
          onClick={() => {
            setFiles((files) => files.filter((f) => f.name !== file.name));
          }}
        >
          Deletar
        </Button>
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Button variant={"link"}>Adicionar Imagens</Button>
      </div>
      <aside className="mt-[16px] flex flex-row flex-wrap">{thumbs}</aside>
    </section>
  );
}
