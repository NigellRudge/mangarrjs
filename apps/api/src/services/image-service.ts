import Injectable from "@decorators/injectable";
import axios, { AxiosInstance } from "axios";
import { MangaSourceType, MangaSourceUrlMap } from "@mangaClients/shared/types";
import GeneralError from "@errors/general-error";
import {
  HEADER_CONTENT_TYPES,
  HeaderImageContentType,
} from "@utils/request-utils";
import sharp from "sharp";
import CacheService from "@services/cache-service";

@Injectable()
export default class ImageService {
  private readonly axios: AxiosInstance;

  constructor(private readonly cacheService: CacheService) {
    this.axios = axios.create({
      headers: {
        accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "i",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
      },
    });
  }

  async get(
    imageUrl: string,
    source: MangaSourceType,
    contentType: HeaderImageContentType,
    w: string = "800",
    q: string = "75",
    skip: boolean = false,
  ) {
    const referer = MangaSourceUrlMap[source];

    if (!imageUrl || !imageUrl.startsWith("https://") || !referer) {
      throw new GeneralError("missing image URL");
    }

    const width = parseInt(w as string);
    const quality = parseInt(q as string);

    const cacheKey = `${imageUrl}-${quality}-${width}-${referer}`;
    const cachedData = this.cacheService.getCachedImage(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const response = await this.axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 5000,
      headers: {
        referer,
      },
    });
    const buffer = Buffer.from(response.data);
    const metadata = await sharp(buffer).metadata();

    const isTheSameFormat =
      metadata.format === contentType.replace("image/", "");
    const hasNoWidth = !Boolean(width);
    const isOriginalImageSmaller = width >= metadata.width!;

    const shouldSkip =
      skip || isTheSameFormat || hasNoWidth || isOriginalImageSmaller;

    if (shouldSkip) {
      await this.cacheService.cacheImage(cacheKey, buffer);
      return buffer;
    }

    let transformer = sharp(buffer).resize({ width, withoutEnlargement: true });

    if (contentType === HEADER_CONTENT_TYPES.AVIF) {
      transformer = transformer.avif({ quality });
    } else if (contentType === HEADER_CONTENT_TYPES.WEBP) {
      transformer = transformer.webp({ quality });
    } else {
      transformer = transformer.jpeg({ quality });
    }
    const optimizedBuffer = await transformer.toBuffer();
    await this.cacheService.cacheImage(cacheKey, optimizedBuffer);
    return optimizedBuffer;
  }
}
