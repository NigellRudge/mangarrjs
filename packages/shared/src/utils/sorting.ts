export const statusSortOrder = [
  "Ongoing",
  "Completed",
  "Upcoming",
  "On-hiatus",
  "Cancelled",
];

export const genreOrder = [
  "Action",
  "Adventure",
  "Thriller",
  "Drama",
  "Comedy",
  "Crime",
];

export const mediaOrder = ["Manga", "Manhwa", "Manhua", "Novel", "One-shot"];

export const getSortOrder = (statusType: SortOrderType) => {
  switch (statusType) {
    case "genre":
      return genreOrder;
    case "media":
      return mediaOrder;
    case "status":
      return statusSortOrder;

    default:
      return null;
  }
};

type SortOrderType = "genre" | "media" | "status";

export const sortArrayBySortOrder = (
  input: string[],
  sortOrder?: "asc" | "desc" | SortOrderType,
): string[] => {
  if (!input) return [];
  if (!sortOrder || sortOrder === "asc") return input.sort();
  if (sortOrder === "desc") return input.sort().reverse();
  const selectedSortOrder = getSortOrder(sortOrder);
  if (!selectedSortOrder) return input;
  return input.sort((a, b) => {
    const aIndex = selectedSortOrder.findIndex(
      (item) => item.toLowerCase() === a.toLowerCase(),
    );
    const bIndex = selectedSortOrder.findIndex(
      (item) => item.toLowerCase() === b.toLowerCase(),
    );
    if (aIndex === -1 && bIndex !== -1) {
      return 1;
    }
    if (aIndex !== -1 && bIndex === -1) {
      return -1;
    }
    return aIndex - bIndex;
  });
};
