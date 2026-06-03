import Controller from "@decorators/controller";
import type { Request, Response } from "express";
import {
  getHeaderContentType,
  getRequestQuery,
  MangaSourceType,
  MangaSourceUrlMap,
} from "@mangarr/shared";
import { Get } from "@decorators/request-methods";
import ImageService from "@services/image-service";

@Controller("/image-proxy")
export default class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Get("")
  async getImage(req: Request, res: Response) {
    try {
      const imageUrl = getRequestQuery(req, "src", "string") as string;
      const width = getRequestQuery(req, "w", "string") as string;
      const quality = getRequestQuery(req, "q", "string") as string;
      const source =
        (getRequestQuery(
          req,
          "source",
          "string",
        ) as string as MangaSourceType) || "";
      const referer = MangaSourceUrlMap[source];
      const contentType = getHeaderContentType(req);

      if (!imageUrl || !imageUrl.startsWith("https://") || !referer) {
        res.status(400).send("Missing image URL");
        return;
      }
      const optimizedImage = await this.imageService.get(
        imageUrl,
        source,
        contentType,
        width,
        quality,
        true,
      );

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(optimizedImage);
      return;
    } catch (error: any) {
      console.error("Image proxy error:", error?.message);
      return res.status(500).send("Failed to fetch image");
    }
  }
}
