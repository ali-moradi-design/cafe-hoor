// After `next build`: completes .next/standalone so it runs on its own
// (`node .next/standalone/server.js`). Next.js leaves public/ and .next/static
// out of it (see the Next.js docs for `output: "standalone"`).
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
cpSync(`${root}public`, `${root}.next/standalone/public`, { recursive: true });
cpSync(`${root}.next/static`, `${root}.next/standalone/.next/static`, { recursive: true });
console.log("standalone: public/ and .next/static copied");
