import { PatternTranslations } from "./types";
import { creationalUk } from "./uk/creational";
import { structuralUk } from "./uk/structural";
import { behavioralUk } from "./uk/behavioral";
import { reactUk } from "./uk/react";
import { architectureUk } from "./uk/architecture";
import { architectureDetailsUk } from "./uk/architecture-details";

export const ukPatternTranslations: PatternTranslations = {
  ...creationalUk,
  ...structuralUk,
  ...behavioralUk,
  ...reactUk,
  ...architectureUk,
  ...architectureDetailsUk,
};
