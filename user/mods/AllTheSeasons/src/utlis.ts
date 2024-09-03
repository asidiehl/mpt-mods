import { Season } from "@spt/models/enums/Season";
import { randomSeasonWeighting } from "../config/config.json";

export const SeasonMap = {
  0: "SUMMER",
  1: "AUTUMN",
  2: "WINTER",
  3: "SPRING",
  4: "STORM",
};

export const getWeightedSeason = (): Season => {
  const all = [];
  const itemKeys = Object.keys(randomSeasonWeighting);
  for (const key of itemKeys) {
    for (let i = 0; i < randomSeasonWeighting[key]; i++) {
      all.push(key);
    }
  }

  const season: keyof typeof Season =
    all[Math.round(Math.random() * (all.length - 1))];

  return Season[season];
};
