import "server-only";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { db, schema } from "@/db";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Yüklenen kapağı web'e uygun hâle getirir (döndürme, en fazla 1200 px genişlik,
 * CMYK → sRGB, JPEG) ve veritabanına yazar. Dönen ölçüler 3D kitabın oranını belirler.
 */
export async function storeCover(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Dosya 10 MB'tan büyük.");
  const input = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .toColorspace("srgb")
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  const id = randomBytes(12).toString("hex");
  await db.insert(schema.media).values({
    id,
    contentType: "image/jpeg",
    width: info.width,
    height: info.height,
    byteSize: data.length,
    data,
  });
  return { url: `/media/${id}`, width: info.width, height: info.height };
}

export async function deleteMediaByUrl(url: string | null | undefined) {
  const id = url?.startsWith("/media/") ? url.slice(7) : null;
  if (id) await db.delete(schema.media).where(eq(schema.media.id, id));
}
