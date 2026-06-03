import Injectable from "@decorators/injectable";
import { GeneralError } from "@mangarr/shared/errors";
import queryString from "query-string";

import {
  ChapterResponse,
  MangaInfoResponse,
  MangaResponse,
  MangaSourceGenre,
  MangaStatus,
  SearchFilters,
  DiscoverFilters,
} from "@mangarr/shared";
import { hasItems } from "@mangarr/shared";
import DocumentParser from "@mangarr/shared/document-parser";
import { MangaPillDTO } from "@mangarr/shared/dtos";
import MangaSourceClient from "@mangarr/shared/http";
import {
  MangaPillChapter,
  MangaPillManga,
} from "@mangarr/shared/types/manga-pill";
import { GetWordsForMangaSource } from "@mangarr/shared/synonyms";

const BASE_URL = "https://mangapill.com";

@Injectable()
export default class MangaPillClient extends MangaSourceClient {
  constructor() {
    super(BASE_URL);
  }

  public async getNewChapters(): Promise<ChapterResponse[]> {
    await this.loadParser("/chapters");

    return this.documentParser
      .getElementsBySelector(
        "body > div:nth-child(3) > div.grid.grid-cols-2.md\\:grid-cols-4.lg\\:grid-cols-6.gap-3 > div",
      )
      .map((_, element) => {
        try {
          const imageElement = this.documentParser.getSingleElement(
            "a",
            element,
          );
          const chapterUrl = this.documentParser
            .select(imageElement)
            .attr("href");
          const coverImage =
            this.documentParser.getElementAttribute(
              "img",
              "data-src",
              imageElement,
            ) || "";
          const [chapterNumberDiv, mangaNameDiv] =
            this.documentParser.getElementsBySelector("div.px-1 > a", element);
          const chapterNumber = this.documentParser
            .getElementText("div.mt-3", chapterNumberDiv)
            ?.replace("#", "");

          const mangaName = this.documentParser.getElementText(
            "div:nth-child(1)",
            mangaNameDiv,
          );
          const translatedMangaName = this.documentParser.getElementText(
            "div:nth-child(2)",
            mangaNameDiv,
          );
          const mangaId = MangaPillDTO.mangaIdFormChapterUrl(chapterUrl);
          const mangaUrl = Boolean(mangaId)
            ? `${BASE_URL}/manga/${mangaId}`
            : null;
          return {
            mangaUrl,
            coverImage,
            chapterNumber,
            name: translatedMangaName || mangaName,
            type: "chapter",
            chapterUrl: Boolean(chapterUrl) ? `${BASE_URL}${chapterUrl}` : null,
          } as MangaPillChapter;
        } catch {
          return null;
        }
      })
      .toArray()
      .filter(Boolean)
      .map(MangaPillDTO.createChapterResponse);
  }

  public async quickSearch(q: string): Promise<MangaResponse[]> {
    await this.loadParser(`/quick-search?${queryString.stringify({ q })}`);
    return this.documentParser
      .getElementsBySelector("div.grid.gap-3 > a")
      .map((_, element) => {
        const mangaUrl = this.documentParser.select(element).attr("href");
        const coverImage =
          this.documentParser.getElementAttribute("img", "src", element) || "";
        const mangaName = this.documentParser.getElementText(
          "div.ml-3> div > div.font-black",
          element,
        );

        return {
          id: MangaPillDTO.getMangaIdFromUrl(mangaUrl),
          name: mangaName,
          type: "manga",
          coverImage,
          mangaUrl: Boolean(mangaUrl) ? `${BASE_URL}${mangaUrl}` : "",
        } as MangaPillManga;
      })
      .filter(Boolean)
      .toArray()
      .map(MangaPillDTO.createMangaResponse)
      .slice(0, 5);
  }

  public async search(
    query: string,
    searchFilters: SearchFilters = {
      page: 1,
    },
  ): Promise<MangaResponse[]> {
    const { page, genres } = searchFilters;
    await this.loadParser(
      `/search?${queryString.stringify({
        q: query,
        page,
        genres: hasItems(genres) ? genres : undefined,
      })}`,
    );
    return this.documentParser
      .getElementsBySelector(
        "div.my-3.grid.justify-end.gap-3.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-5 > div",
      )
      .map((_, element) => {
        try {
          const imageElement = this.documentParser.getSingleElement(
            "a",
            element,
          );
          const mangaUrl = this.documentParser
            .select(imageElement)
            .attr("href");
          const coverImage =
            this.documentParser.getElementAttribute(
              "img",
              "data-src",
              imageElement,
            ) || "";
          const mangaName = this.documentParser.getElementText(
            "div.flex.flex-col.justify-end > a.mb-2 > div",
            element,
          );

          return {
            id: MangaPillDTO.getMangaIdFromUrl(mangaUrl),
            name: mangaName,
            type: "manga",
            coverImage,
            mangaUrl: Boolean(mangaUrl) ? `${BASE_URL}${mangaUrl}` : "",
          } as MangaPillManga;
        } catch {
          return null;
        }
      })
      .toArray()
      .filter(Boolean)
      .map(MangaPillDTO.createMangaResponse);
  }

  public async getGenres(): Promise<MangaSourceGenre[]> {
    await this.loadParser(`${BASE_URL}/search`);
    return this.documentParser
      .getElementsBySelector(
        "body > div:nth-child(3) > div > div:nth-child(2) > form > div > div:nth-child(3) > div > div.m-1",
      )
      .map((_, element) => this.mapGenre(element))
      .toArray()
      .filter(Boolean);
  }

  public async getInfo(id: string | number): Promise<MangaInfoResponse> {
    const response = await this.client.get(`/manga/${id}`);
    if (response.status !== 200) {
      throw new GeneralError("Could not get info");
    }

    this.documentParser = new DocumentParser(response.data.toString());
    const containerElement = this.documentParser.getSingleElement(
      "div.container > div.flex.flex-col.sm\\:flex-row.my-3",
    );
    const coverImage = this.documentParser.getElementAttribute(
      "div > img",
      "data-src",
      containerElement,
    )!;
    const title = this.documentParser.getElementText(
      "div.flex.flex-col > div.mb-3 > h1",
      containerElement,
    );
    const description = this.documentParser.getElementText(
      "div.flex.flex-col > div.mb-3 > p",
      containerElement,
    );

    const [typeDiv, statusDiv, yearDiv] =
      this.documentParser.getElementsBySelector(
        "div.flex.flex-col >  div.grid.grid-cols-1.md\\:grid-cols-3.gap-3.mb-3 > div",
      );
    const publishYear = this.documentParser.getElementText("div", yearDiv);
    const status = this.documentParser.getElementText(
      "div",
      statusDiv,
    ) as MangaStatus;
    const genres = this.documentParser
      .getElementsBySelector("div.mb-3 > a", containerElement)
      .map((_, element) => {
        return this.documentParser.select(element).text();
      })
      .toArray();

    const chapters = this.documentParser.getElementsBySelector(
      "div#chapters > div.my-3.grid.grid-cols-1.md\\:grid-cols-3.lg\\:grid-cols-6 > a ",
    ).length;

    return MangaPillDTO.createInfoResponse({
      id: id as string,
      coverImage,
      title,
      description,
      status,
      genres,
      releaseDate: new Date(`01-01-${publishYear}`),
      source: "manga-pill",
      chapters,
    });
  }

  public async getMediaStatusTypes(): Promise<string[]> {
    return [
      "publishing",
      "finished",
      "on hiatus",
      "discontinued",
      "not yet published",
    ];
  }

  public async getSupportedMediaTypes(): Promise<string[]> {
    return ["manga", "novel", "one-shot", "doujinshi", "manhua", "oel"];
  }

  public async isHealthy(): Promise<Boolean> {
    try {
      const res = await this.client.get("/", {
        timeout: 3000,
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  public async discoverMangas(
    inputFilters: DiscoverFilters,
  ): Promise<MangaResponse[]> {
    const filters = this.mapFilters(inputFilters);
    await this.loadParser(`/search?${queryString.stringify(filters)}`);
    return this.documentParser
      .getElementsBySelector(
        "div.my-3.grid.justify-end.gap-3.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-5 > div",
      )
      .map((_, element) => {
        try {
          const imageElement = this.documentParser.getSingleElement(
            "a",
            element,
          );
          const mangaUrl = this.documentParser
            .select(imageElement)
            .attr("href");
          const coverImage =
            this.documentParser.getElementAttribute(
              "img",
              "data-src",
              imageElement,
            ) || "";
          const mangaName = this.documentParser.getElementText(
            "div.flex.flex-col.justify-end > a.mb-2 > div",
            element,
          );

          return {
            id: MangaPillDTO.getMangaIdFromUrl(mangaUrl),
            name: mangaName,
            type: "manga",
            coverImage,
            mangaUrl: Boolean(mangaUrl) ? `${BASE_URL}${mangaUrl}` : "",
          } as MangaPillManga;
        } catch {
          return null;
        }
      })
      .toArray()
      .filter(Boolean)
      .map(MangaPillDTO.createMangaResponse);
  }

  private mapGenre(element: any): MangaSourceGenre | null {
    const label = this.documentParser.getSingleElement(
      "label > input",
      element,
    );
    if (!label) return null;
    const name = label.attribs.value.trim();

    return {
      id: name,
      name,
      sourceId: "manga-pill",
    };
  }

  private async loadParser(url: string) {
    const response = await this.client.get(url);
    if (response.status !== 200) {
      throw new GeneralError("could not load featured chapters");
    }
    this.documentParser = new DocumentParser(response.data);
  }

  private mapFilters(filters?: DiscoverFilters): Record<string, any> {
    if (!filters) {
      return {
        page: 1,
        pageSize: 25,
        genres: [],
      };
    }
    return {
      q: "",
      status: GetWordsForMangaSource(filters.statusTypes, "manga-pill"),
      type: GetWordsForMangaSource(filters.mediaTypes, "manga-pill"),
      page: filters.page || 1,
      genre: hasItems(filters.genres) ? filters.genres : undefined,
    };
  }
}
