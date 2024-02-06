import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import ImageKit from "imagekit";

type FileWithPreview = File & { preview: string };

const imagek = new ImageKit({
  publicKey: "public_/Z3q0bEbIVuDfOZfV8Ar3nFy0SI=",
  privateKey: "private_wbgoS5GV4J2aFgNSffX5iV2rsug=",
  urlEndpoint: "https://ik.imagekit.io/ilicura/",
});

export default function Dropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
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
      <div className="mb-8 mr-8 box-border inline-flex h-[100px] w-[100px] rounded-sm border-[1px] border-[#eaeaea] p-[4px]">
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
      <Button
        onClick={async () => {
          const data = new FormData();
          data.append("file", file);
          data.append("fileName", file.name);
          data.append("useUniqueFileName", "true");

          const upload = await imagek.upload({
            //@ts-expect-error next line
            file: file,
            fileName: file.name,
            useUniqueFileName: true,
          });
        }}
      >
        Enviar
      </Button>
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
        <p>
          Drag `&apos;`n`&apos;` drop some files here, or click to select files
        </p>
      </div>
      <aside className="mt-[16px] flex flex-row flex-wrap">{thumbs}</aside>
    </section>
  );
}
