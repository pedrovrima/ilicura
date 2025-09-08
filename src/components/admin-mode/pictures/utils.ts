type ResizeOpts = {
  maxMegaPixels?: number; // e.g. 24.9 to stay under 25MP
  maxWidth?: number; // optional absolute caps
  maxHeight?: number; // optional absolute caps
  mimeType?: "image/jpeg" | "image/webp" | "image/png";
  quality?: number; // 0..1 (JPEG/WEBP)
};

async function loadBitmap(file: File): Promise<ImageBitmap> {
  // Best path: handles EXIF rotation
  if ("createImageBitmap" in window) {
    return await createImageBitmap(file, {
      imageOrientation: "from-image" as any,
    });
  }
  // Fallback via <img>
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    (img as any).decoding = "async";
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = rej;
      img.src = url;
    });
    // Draw to canvas later; for type parity, convert to ImageBitmap if available
    if ("createImageBitmap" in window) return await createImageBitmap(img);
    // Last-resort shim: draw from HTMLImageElement directly (handled below)
    // @ts-expect-error we’ll handle HTMLImageElement path below
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function makeCanvas(w: number, h: number): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

async function drawToCanvas(
  source: ImageBitmap | HTMLImageElement,
  targetW: number,
  targetH: number,
): Promise<HTMLCanvasElement | OffscreenCanvas> {
  const canvas = makeCanvas(targetW, targetH);
  // Step-down scaling in 2–3 passes helps quality and memory for large images
  const steps: Array<[number, number]> = [];
  let curW = (source as any).width || (source as HTMLImageElement).naturalWidth;
  let curH =
    (source as any).height || (source as HTMLImageElement).naturalHeight;

  // Build intermediate sizes (shrink by ~0.66 until close to target)
  while (curW * 0.66 > targetW) {
    curW = Math.max(targetW, Math.floor(curW * 0.66));
    curH = Math.max(targetH, Math.floor(curH * 0.66));
    steps.push([curW, curH]);
  }
  steps.push([targetW, targetH]);

  let prev: ImageBitmap | HTMLImageElement = source;
  for (let i = 0; i < steps.length; i++) {
    const [w, h] = steps[i];
    const stepCanvas = makeCanvas(w, h);
    const ctx =
      (stepCanvas as HTMLCanvasElement).getContext?.("2d", { alpha: false }) ||
      (stepCanvas as OffscreenCanvas).getContext("2d", { alpha: false })!;
    // ImageSmoothing for better quality
    (ctx as any).imageSmoothingEnabled = true;
    (ctx as any).imageSmoothingQuality = "high";
    ctx.drawImage(prev as any, 0, 0, w, h);

    // Prepare for next step
    if (i < steps.length - 1) {
      // Convert stepCanvas to ImageBitmap (fast for next draw) if available
      if ("convertToBlob" in stepCanvas) {
        const blob = await (stepCanvas as OffscreenCanvas).convertToBlob();
        prev = await createImageBitmap(blob);
      } else {
        const bmp = await new Promise<ImageBitmap>((resolve) => {
          (stepCanvas as HTMLCanvasElement).toBlob(async (b) =>
            resolve(await createImageBitmap(b!)),
          );
        });
        prev = bmp;
      }
    } else {
      // Last step: return this canvas
      return stepCanvas as any;
    }
  }
  // Shouldn’t reach here
  return canvas as any;
}

async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  if ("convertToBlob" in canvas) {
    return await (canvas as OffscreenCanvas).convertToBlob({
      type: mimeType,
      quality,
    });
  }
  return await new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      mimeType,
      quality,
    );
  });
}

export async function resizeImageFile(
  file: File,
  {
    maxMegaPixels = 24.9,
    maxWidth,
    maxHeight,
    mimeType = "image/jpeg",
    quality = 0.85,
  }: ResizeOpts = {},
): Promise<File> {
  const bitmap = await loadBitmap(file);
  const srcW =
    (bitmap as any).width || (bitmap as HTMLImageElement).naturalWidth;
  const srcH =
    (bitmap as any).height || (bitmap as HTMLImageElement).naturalHeight;

  // Target by MP
  let scale = Math.sqrt((maxMegaPixels * 1_000_000) / (srcW * srcH));
  scale = Math.min(1, scale); // never upscale

  // Also respect maxWidth/maxHeight if provided
  if (maxWidth) scale = Math.min(scale, maxWidth / srcW);
  if (maxHeight) scale = Math.min(scale, maxHeight / srcH);

  if (scale >= 1) {
    // No resize needed; optionally transcode to ensure JPEG
    return file.type === mimeType
      ? file
      : new File(
          [await file.arrayBuffer()],
          file.name.replace(/\.\w+$/, ".jpg"),
          { type: mimeType },
        );
  }

  const targetW = Math.max(1, Math.floor(srcW * scale));
  const targetH = Math.max(1, Math.floor(srcH * scale));

  const canvas = await drawToCanvas(bitmap, targetW, targetH);
  if ("close" in bitmap) (bitmap as ImageBitmap).close?.();

  const out = await canvasToBlob(canvas, mimeType, quality);
  const newName =
    file.name.replace(/\.(jpe?g|png|webp|gif|bmp|tiff?)$/i, "") +
    `_resized_${targetW}x${targetH}.jpg`;

  return new File([out], newName, { type: mimeType, lastModified: Date.now() });
}
