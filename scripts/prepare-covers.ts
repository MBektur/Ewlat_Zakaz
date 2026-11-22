/**
 * Baskı için hazırlanmış (çoğunlukla CMYK, çok büyük) kapak dosyalarını
 * web'e uygun sRGB JPEG'e çevirir. Oran korunur, yalnızca genişlik küçülür.
 *
 * Kullanım:
 *   npx tsx scripts/prepare-covers.ts <kaynak-klasör> <hedef-klasör> [genişlik]
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

async function main() {
  const [src, out, widthArg] = process.argv.slice(2);
  if (!src || !out) {
    console.error("Kullanım: npx tsx scripts/prepare-covers.ts <kaynak> <hedef> [genişlik]");
    process.exit(1);
  }
  const width = Number(widthArg ?? 900);
  await mkdir(out, { recursive: true });
  const files = (await readdir(src)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)).sort();
  for (const file of files) {
    const target = path.join(out, file.replace(/\.[^.]+$/, ".jpg"));
    const info = await sharp(path.join(src, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .toColorspace("srgb")
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);
    console.log(`${file} → ${path.basename(target)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
