import data from "@content/cafe.json";

import { cafeSchema, type Cafe } from "../model/schema";

// Parsed once at build time: a typo in `content/cafe.json` fails the build.
const cafe = cafeSchema.parse(data);

export function getCafe(): Cafe {
  return cafe;
}
