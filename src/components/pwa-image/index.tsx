"use client";
import { useState } from "react";

export default function PWAImage({
  src,
  className,
  alt,
}: {
  src: string;
  className: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  const cacheSRC = fallbackURLExtractor(src);
  const setImageSrc = (src: string) => {
    const newSrc = src !== imgSrc ? src : "/no-photo.webp";
    console.log(`setting as ${newSrc}`);
    setImgSrc(newSrc);
  };
  return (
    <img
      alt={alt}
      className={className}
      src={imgSrc}
      onLoad={() => console.log("load")}
      onError={() => {
        setImageSrc(cacheSRC);
        console.log("error");
        return;
      }}
    />
  );
}

function fallbackURLExtractor(url: string) {
  const index = url.indexOf("/ilicura/");
  return index !== -1 ? url.substring(index) : "";
}
