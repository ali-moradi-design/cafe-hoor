// One-off import: copies the photos listed in content/photos.json from content-raw/
// (Instagram downloads and Pexels stock stand-ins in content-raw/images/stock/, not in
// Git) into assets/photos/ (in Git), at most 2000 px (stock: 960 px),
// and stores each photo's size back into content/photos.json.
// Usage: pnpm photos:import
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const list = JSON.parse(readFileSync("content/photos.json", "utf8"));
mkdirSync("assets/photos", { recursive: true });

for (const photo of list) {
  const out = `assets/photos/${photo.id}.jpg`;
  if (photo.source) {
    const src = `content-raw/images/${photo.source}`;
    const max = photo.stock ? 960 : 2000;
    if (!existsSync(src)) throw new Error(`Missing source ${src} for "${photo.id}"`);
    await sharp(src)
      .rotate()
      // Stock stand-ins are only shown small beside a dish.
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(out);
  }
  const { width, height } = await sharp(out).metadata();
  Object.assign(photo, { width, height });
}
writeFileSync("content/photos.json", JSON.stringify(list, null, 2) + "\n");

// Brand: the Instagram profile picture is the only logo file we have.
if (existsSync("content-raw/logo-profile.jpg")) {
  mkdirSync("assets/brand", { recursive: true });
  await sharp("content-raw/logo-profile.jpg").jpeg({ quality: 92 }).toFile("assets/brand/logo.jpg");
}
console.log(`imported ${list.length} photos`);
