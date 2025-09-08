import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "@/trpc/react";

import ImageKit from "imagekit";
import { upload } from "@imagekit/javascript";

import { env } from "@/env";
import { Loader } from "lucide-react";
import { resizeImageFile } from "./utils";

type FileWithPreview = File & { preview: string };

const xhr = new XMLHttpRequest();
xhr.upload.onprogress = (e) => {
  if (e.lengthComputable) {
    const pct = Math.round((e.loaded / e.total) * 100);
  } else {
  }
};

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

  const thumbs = files.map((file, index) => (
    <FileThumb
      key={file.name}
      file={file}
      setFiles={setFiles}
      addImageApi={addImageApi}
      refetchImages={refetchImages}
      sexId={sexId}
    />
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

const FileThumb = ({
  file,
  setFiles,
  addImageApi,
  refetchImages,
  sexId,
}: {
  file: FileWithPreview;
  setFiles: (files: FileWithPreview[]) => void;
  addImageApi: any;
  refetchImages: () => void;
  sexId: number;
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  return (
    <div className="relative flex flex-row" key={file.name}>
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
          disabled={addImageApi.isLoading}
          onClick={async (e) => {
            setUploadProgress(2);
            e.preventDefault();
            const { token, expire, signature } = await fetch(
              "/api/imagekit-auth",
            ).then((r) => r.json());

            const safeFile = await resizeImageFile(file, {
              maxMegaPixels: 24.9, // stay below ImageKit’s pre-processing limit
              // Optionally also clamp a dimension:
              // maxWidth: 8000,
              mimeType: "image/jpeg",
              quality: 0.85,
            });

            await upload({
              file: safeFile,
              fileName: safeFile.name,
              publicKey: process.env.NEXT_PUBLIC_IMAGEK_PUBLIC_KEY!, // safe to expose
              token,
              signature,
              expire,
              onProgress: (e) =>
                setUploadProgress(Math.round((e.loaded / e.total) * 100) - 1), // <-- works
              xhr, // optional
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
                  setFiles((files: FileWithPreview[]) =>
                    files.filter((f: FileWithPreview) => f.name !== file.name),
                  );

                  setUploadProgress(100);
                  refetchImages();
                }
              })
              .catch((err) => {});
          }}
        >
          {addImageApi.isLoading ? (
            <Loader size={16} className="animate-spin-slow" />
          ) : (
            "Enviar"
          )}
        </Button>
        <Button
          variant={"destructive"}
          disabled={addImageApi.isLoading}
          onClick={() => {
            setFiles((files) =>
              files.filter((f: FileWithPreview) => f.name !== file.name),
            );
          }}
        >
          {addImageApi.isLoading ? (
            <Loader size={16} className="animate-spin-slow" />
          ) : (
            "Deletar"
          )}
        </Button>
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-200 opacity-90">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};
