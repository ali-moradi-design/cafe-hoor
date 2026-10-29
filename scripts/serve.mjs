// Runs the built standalone server like production (`pnpm build` first).
// Usage: node scripts/serve.mjs [port]   (default 4321)
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = process.argv[2] ?? "4321";
const server = fileURLToPath(new URL("../.next/standalone/server.js", import.meta.url));
const child = spawn(process.execPath, [server], {
  env: { ...process.env, PORT: port, HOSTNAME: "127.0.0.1", NODE_ENV: "production" },
  stdio: ["ignore", "inherit", "inherit"],
});
console.log(`standalone server on http://127.0.0.1:${port}`);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
