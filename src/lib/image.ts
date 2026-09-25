/**
 * Client-side image downscaling/compression (uses Image/canvas, browser only).
 *
 * Images are shrunk before upload so the stored blobs (and page loads) stay
 * small. `fileToCompressedBlob` returns a Blob ready to POST to /api/upload;
 * `fileToCompressedDataUrl` returns a data URL (kept for any inline preview use).
 */

interface Scaled {
  canvas: HTMLCanvasElement;
}

/** Loads the file, downscales to fit `maxDim`, returns a canvas — or null when
 * the image has no intrinsic size (e.g. an SVG), so callers keep the original. */
async function scaleToCanvas(file: File, maxDim: number): Promise<Scaled | null> {
  const sourceUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Không đọc được tệp"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Không tải được ảnh"));
    image.src = sourceUrl;
  });

  let { width, height } = img;
  if (!width || !height) return null; // e.g. SVG without intrinsic size

  const longest = Math.max(width, height);
  if (longest > maxDim) {
    const scale = maxDim / longest;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas };
}

/**
 * Downscales and compresses an image File to a Blob (WebP, JPEG fallback).
 * Falls back to the original file for inputs without an intrinsic size (SVG).
 */
export async function fileToCompressedBlob(
  file: File,
  maxDim = 1000,
  quality = 0.82
): Promise<Blob> {
  const scaled = await scaleToCanvas(file, maxDim);
  if (!scaled) return file;

  const blob = await new Promise<Blob | null>((resolve) =>
    scaled.canvas.toBlob(resolve, "image/webp", quality)
  );
  if (blob) return blob;

  const jpeg = await new Promise<Blob | null>((resolve) =>
    scaled.canvas.toBlob(resolve, "image/jpeg", quality)
  );
  return jpeg ?? file;
}

/** Downscales and compresses an image File to a data URL. */
export async function fileToCompressedDataUrl(
  file: File,
  maxDim = 1000,
  quality = 0.82
): Promise<string> {
  const scaled = await scaleToCanvas(file, maxDim);
  if (!scaled) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error("Không đọc được tệp"));
      reader.readAsDataURL(file);
    });
  }
  const webp = scaled.canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp")) return webp;
  return scaled.canvas.toDataURL("image/jpeg", quality);
}
