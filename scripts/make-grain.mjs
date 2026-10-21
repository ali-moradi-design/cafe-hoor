// Makes public/textures/grain.jpg, the page background: a dark film-grain tile
// measured from the reference site's background (mean luminance ≈ 31/255, pixel
// noise σ ≈ 4.6 overall, soft unevenness σ ≈ 1–1.3, about 500 bright specks per tile). It is
// generated, not copied, and seeded, so every run gives the same file.
// Run: node scripts/make-grain.mjs
import { mkdir } from "node:fs/promises";

import sharp from "sharp";

const W = 1244;
const H = 910;
const MEAN = 30.9;
const env = (name, value) => Number(process.env[name] ?? value);
// Strength of each layer, from per-pixel noise up to large clouds (fitted by
// measuring the result against the reference).
const PIXEL = env("PIXEL", 2.4);
const FINE = env("FINE", 4.4);
const SMALL = env("SMALL", 1.2);
const MOTTLE = env("MOTTLE", 0.9);
const CLOUD = env("CLOUD", 1.75);
const SPECKS = 500;

let seed = 20261021;
function random() {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function gaussian() {
  return Math.sqrt(-2 * Math.log(random() || 1e-9)) * Math.cos(2 * Math.PI * random());
}

// Soft unevenness: coarse random grids that wrap at the edges (so the tile repeats
// without seams), smoothly interpolated up to full size.
const smooth = (t) => t * t * (3 - 2 * t);
function octave(cell) {
  const gw = Math.ceil(W / cell);
  const gh = Math.ceil(H / cell);
  const grid = Float32Array.from({ length: gw * gh }, gaussian);
  const at = (gx, gy) => grid[(gy % gh) * gw + (gx % gw)];
  return (x, y) => {
    const fx = x / cell;
    const fy = y / cell;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = smooth(fx - x0);
    const ty = smooth(fy - y0);
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return top * (1 - ty) + bottom * ty;
  };
}
// Grain clumps of a couple of pixels, small specks of unevenness, mottling and clouds.
const fine = octave(2);
const small = octave(7);
const mottle = octave(40);
const cloud = octave(180);

const pixels = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    pixels[y * W + x] =
      MEAN +
      gaussian() * PIXEL +
      fine(x, y) * FINE +
      small(x, y) * SMALL +
      mottle(x, y) * MOTTLE +
      cloud(x, y) * CLOUD;
  }
}

// Dust: small bright specks, a few of them two pixels wide.
for (let index = 0; index < SPECKS; index++) {
  const x = Math.floor(random() * W);
  const y = Math.floor(random() * H);
  const value = 60 + random() * 75;
  pixels[y * W + x] = value;
  if (random() < 0.25) pixels[y * W + ((x + 1) % W)] = value * 0.7;
}

const out = Buffer.alloc(W * H);
for (let index = 0; index < out.length; index++) {
  out[index] = Math.max(0, Math.min(255, Math.round(pixels[index])));
}

await mkdir("public/textures", { recursive: true });
await sharp(out, { raw: { width: W, height: H, channels: 1 } })
  .jpeg({ quality: 92 })
  .toFile("public/textures/grain.jpg");
console.log("public/textures/grain.jpg");
