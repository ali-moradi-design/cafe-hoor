import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import boundaries from "eslint-plugin-boundaries";

// Feature-Sliced Design layers, top to bottom. A layer may import only the layers below it;
// slices on the same layer never import each other.
const layers = ["app", "views", "widgets", "features", "entities", "shared"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "views", pattern: "src/views/*", capture: ["slice"] },
        { type: "widgets", pattern: "src/widgets/*", capture: ["slice"] },
        { type: "features", pattern: "src/features/*", capture: ["slice"] },
        { type: "entities", pattern: "src/entities/*", capture: ["slice"] },
        { type: "shared", pattern: "src/shared/*", capture: ["segment"] },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        2,
        {
          default: "disallow",
          policies: layers.map((layer, index) => ({
            from: { element: { type: layer } },
            allow: {
              to: {
                element: {
                  types: {
                    // `shared` segments may use each other.
                    anyOf: layer === "shared" ? ["shared"] : layers.slice(index + 1),
                  },
                },
              },
            },
          })),
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "content-raw/**"]),
]);

export default eslintConfig;
