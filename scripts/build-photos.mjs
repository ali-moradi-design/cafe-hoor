// Build step: responsive AVIF/WebP/JPEG variants of assets/photos/* into public/photos/,
// plus the logo, favicons and the Open Graph image. Skips files that are up to date.
// Runs before `dev` and `build` (see package.json).
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import sharp from "sharp";

export const WIDTHS = [480, 960, 1600];
const list = JSON.parse(readFileSync("content/photos.json", "utf8"));
mkdirSync("public/photos", { recursive: true });
mkdirSync("public/brand", { recursive: true });

const fresh = (src, out) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;
let written = 0;

async function emit(src, out, pipeline) {
  if (fresh(src, out)) return;
  await pipeline(sharp(src).rotate()).toFile(out);
  written++;
}

for (const photo of list) {
  const src = `assets/photos/${photo.id}.jpg`;
  for (const width of WIDTHS.filter((w) => w <= photo.width)) {
    const base = `public/photos/${photo.id}-${width}`;
    const resize = (s) => s.resize({ width });
    await emit(src, `${base}.avif`, (s) => resize(s).avif({ quality: 52, effort: 4 }));
    await emit(src, `${base}.webp`, (s) => resize(s).webp({ quality: 72 }));
    await emit(src, `${base}.jpg`, (s) => resize(s).jpeg({ quality: 78, mozjpeg: true }));
  }
}

const logo = "assets/brand/logo.jpg";
await emit(logo, "public/brand/logo-128.webp", (s) => s.resize(128).webp({ quality: 85 }));
await emit(logo, "src/app/icon.png", (s) => s.resize(512).png());
await emit(logo, "src/app/apple-icon.png", (s) => s.resize(180).png());

const og = "assets/photos/fountain.jpg";
await emit(og, "public/og.jpg", (s) =>
  s.resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 80, mozjpeg: true }),
);
console.log(`photos: ${written} files written`);
