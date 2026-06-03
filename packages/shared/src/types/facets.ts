export type GenreFacet = {};

export type StatusFacet =
  | "ongoing"
  | "finished"
  | "canceled"
  | "hiatus"
  | "upcoming";

export type MediaTypeFacet =
  | "Manga"
  | "Novel"
  | "One-short"
  | "Doujin"
  | "Light novel"
  | "Manhwa"
  | "Manhua";

export type SortFacet = {};

type FacetFilters = {
  genres: GenreFacet[];
  statuses: StatusFacet[];
  mediaTypes: MediaTypeFacet[];
  sorting: SortFacet[];
};
