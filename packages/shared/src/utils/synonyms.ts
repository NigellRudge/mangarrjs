import { hasItems } from "./list";
import { pipe, uniq, isNotEmpty } from "ramda";
import { titleCase } from "./string-utils";
import { MangaSourceType } from "../types/response-types";

type MediaTypeSynonym = {
  actualName: string;
  synonyms: { sourceId: MangaSourceType; value: string }[];
};
const mediaTypeSynonymMap: MediaTypeSynonym[] = [
  {
    actualName: "One-shot",
    synonyms: [
      { sourceId: "ani-list", value: "ONE_SHOT" },
      { sourceId: "manga-dex", value: "One-shot" },
      { sourceId: "manga-pill", value: "one-shot" },
    ],
  },
  {
    actualName: "Novel",
    synonyms: [{ sourceId: "ani-list", value: "NOVEL" }],
  },
  {
    actualName: "Manga",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Manhwa",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Manhua",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Webtoon",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Comic",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Doujinshi",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Anthology",
    synonyms: [{ sourceId: "ani-list", value: "MANGA" }],
  },
  {
    actualName: "Novel",
    synonyms: [{ sourceId: "ani-list", value: "NOVEL" }],
  },
  {
    actualName: "Light Novel",
    synonyms: [{ sourceId: "ani-list", value: "NOVEL" }],
  },
  {
    actualName: "Cancelled",
    synonyms: [
      { sourceId: "ani-list", value: "CANCELLED" },
      { sourceId: "manga-dex", value: "cancelled" },
      { sourceId: "manga-pill", value: "discontinued" },
    ],
  },
  {
    actualName: "Ongoing",
    synonyms: [
      { sourceId: "ani-list", value: "RELEASING" },
      { sourceId: "manga-pill", value: "publishing" },
    ],
  },
  {
    actualName: "Completed",
    synonyms: [
      { sourceId: "ani-list", value: "FINISHED" },
      { sourceId: "manga-pill", value: "finished" },
      { sourceId: "manga-dex", value: "completed" },
    ],
  },
  {
    actualName: "Upcoming",
    synonyms: [
      { sourceId: "ani-list", value: "NOT_YET_RELEASED" },
      { sourceId: "manga-pill", value: "not yet published" },
    ],
  },
  {
    actualName: "On-hiatus",
    synonyms: [
      { sourceId: "ani-list", value: "HIATUS" },
      { sourceId: "manga-dex", value: "hiatus" },
      { sourceId: "manga-pill", value: "on hiatus" },
    ],
  },
];

const getSynonym = (word: string) => {
  if (!word) return null;
  return mediaTypeSynonymMap.find((synonymMap) => {
    return synonymMap.synonyms.find((syn) => {
      return syn.value === word;
    });
  });
};

const getSynonymFormNormalized = (word?: string) => {
  if (!word) return null;
  return mediaTypeSynonymMap.find((synonymMap) => {
    return synonymMap.actualName === word;
  });
};

export const GetWordsForMangaSource = (
  inputWords: string[] | undefined,
  source: MangaSourceType,
): string[] => {
  if (!inputWords || !source) return [];
  return inputWords
    .map((word) => {
      const synonym = getSynonymFormNormalized(word);
      if (!synonym) return "";
      const wordForSource = synonym.synonyms.find(
        (syn) => syn.sourceId === source,
      );
      if (!wordForSource) return "";
      return wordForSource.value;
    })
    .filter(isNotEmpty);
};

export const normalizeWordsForSources = (input: string[]): string[] => {
  if (!hasItems(input)) return [];
  return pipe(
    (input: string[]) =>
      input.map((inputString: string) => {
        const synonym = getSynonym(inputString);
        if (!synonym) return inputString;
        return synonym.actualName;
      }),
    (items) => items.filter(Boolean),
    uniq,
    (items) => items.map(titleCase),
  )(input);
};
