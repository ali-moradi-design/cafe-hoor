// After `next build`: Next 16 writes route-segment prefetch files as nested folders
// (`menu/__next.$d$locale/menu/__PAGE__.txt`) but the browser requests them by a flat,
// dot-joined name (`menu/__next.$d$locale.menu.__PAGE__.txt`). A plain static host
// (Nginx) then answers 404 for every prefetch, so we also write the flat copies.
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let copied = 0;

function flatten(segmentDir, parent, prefix) {
  for (const entry of readdirSync(segmentDir)) {
    const path = join(segmentDir, entry);
    const name = `${prefix}.${entry}`;
    if (statSync(path).isDirectory()) flatten(path, parent, name);
    else {
      copyFileSync(path, join(parent, name));
      copied++;
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (!statSync(path).isDirectory()) continue;
    if (entry.startsWith("__next.")) flatten(path, dir, entry);
    else walk(path);
  }
}

walk("out");
console.log(`segments: ${copied} flat copies`);
