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
    setImgSrc(newSrc);
  };
  return (
    <img
      alt={alt}
      className={className}
      src={imgSrc}
      onError={() => {
        setImageSrc(cacheSRC);
        return;
      }}
    />
  );
}

function fallbackURLExtractor(url: string) {
  const index = url.indexOf("/ilicura/");
  return index !== -1 ? url.substring(index) : "";
}
