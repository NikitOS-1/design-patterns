import { PatternTranslations } from "./types";
import { creationalUk } from "./uk/creational";
import { structuralUk } from "./uk/structural";
import { behavioralUk } from "./uk/behavioral";
import { reactUk } from "./uk/react";

// Ukrainian translations for every pattern, keyed by slug.
export const ukPatternTranslations: PatternTranslations = {
  ...creationalUk,
  ...structuralUk,
  ...behavioralUk,
  ...reactUk,
};
