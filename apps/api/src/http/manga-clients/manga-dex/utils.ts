import {
  MangaDexChapter,
  MangaDexCover,
  MangaDexManga,
} from "@mangaClients/manga-dex/types";
import { hasItems, joinSafe } from "@utils/list";
import MangaDexConfig from "@mangaClients/manga-dex/config";
import {
  ChapterListItem,
  MangaInfoResponse,
  MangaListItem,
} from "@mangaClients/shared/types";

const { MANGA_DEX_IMAGES_URL } = MangaDexConfig;

const getGenres = (manga: MangaDexManga) => {
  if (!manga || !hasItems(manga?.attributes?.tags)) return [];
  return manga.attributes.tags
    .filter((tag) => {
      return tag.type === "tag" && tag.attributes.group === "genre";
    })
    .filter(Boolean)
    .map((tag) => {
      return tag.attributes.name["en"];
    });
};

export const getRelatedManga = (chapter: MangaDexChapter | MangaDexCover) => {
  if (!chapter || !hasItems(chapter.relationships)) return null;
  return chapter.relationships.find(
    (relationship) => relationship.type === "manga",
  );
};

export const getCoverFileName = (
  media: MangaDexManga | MangaDexChapter,
): string => {
  if (!media || !hasItems(media?.relationships)) return "";
  const { relationships } = media;
  const covers = relationships.filter((rel) => rel.type === "cover_art");
  let cover = covers.find((cover) => cover.attributes?.locale === "en");
  if (!cover) {
    cover = covers[0];
  }
  if (!cover) return "";
  const fileName = cover?.attributes?.fileName;
  return `${MANGA_DEX_IMAGES_URL}${media.id}/${fileName}.256.jpg`;
};

const getTitle = (manga: any) => {
  const {
    attributes: { title: titles, altTitles },
  } = manga;
  let title = titles["ja-ro"] || titles["en"];
  if (hasItems(altTitles)) {
    const englishTitle = altTitles.find((allTitle: any) =>
      Boolean(allTitle["en"]),
    );
    if (englishTitle) {
      title = englishTitle["en"];
    }
  }
  return title;
};

export const convertMangaDexToStandardManga = (
  mangaDex: MangaDexManga,
): MangaListItem => {
  const {
    id,
    attributes: { title: titles, altTitles, year, description, status },
  } = mangaDex;
  let title = titles["en"] || titles["ja-ro"];
  if (hasItems(altTitles)) {
    const englishTitle = altTitles.find((allTitle) => Boolean(allTitle["en"]));
    if (englishTitle) {
      title = englishTitle["en"];
    }
  }

  return {
    title,
    id,
    sourceId: "manga-dex",
    coverImage: getCoverFileName(mangaDex),
  };
};

export const convertMangaDexChapterToStandardChapter = (
  chapter: MangaDexChapter,
): ChapterListItem => {
  const {
    attributes: {
      coverImage,
      chapter: chapterNumber,
      publishAt,
      translatedLanguage,
      title,
    },
  } = chapter;

  const manga = getRelatedManga(chapter);

  return {
    title: joinSafe([title, chapterNumber], ": #"),
    chapterNumber,
    releaseDate: new Date(publishAt),
    coverImage: coverImage || "",
    mangaId: manga?.id,
    translatedLanguage,
    sourceId: "manga-dex",
  };
};

export const mapCoverResponseToObject = (
  covers: MangaDexCover[],
): Record<string, string> => {
  const coverMap: Record<string, string> = {};
  for (const cover of covers) {
    const mangaId = cover.relationships.find((rel) => rel.type === "manga")
      ?.id as string;
    if (!mangaId) continue;

    if (Boolean(coverMap[mangaId])) continue;
    coverMap[mangaId] =
      `${MANGA_DEX_IMAGES_URL}${mangaId}/${cover.attributes.fileName}.512.jpg`;
  }
  return coverMap;
};

export const normalizeMangaDexMangaInfo = (
  manga: MangaDexManga,
): MangaInfoResponse => ({
  id: manga.id,
  title: getTitle(manga),
  sourceId: "manga-dex",
  genres: getGenres(manga),
  coverImage: getCoverFileName(manga),
  status: manga.attributes.status,
  description: manga.attributes.description["en"],
  publishDate: new Date(`01-01-${manga.attributes.year}`),
});
