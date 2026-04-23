import type { Request, Response } from "express";
import MangaService from "@services/manga-service";
import Injectable from "@decorators/injectable";
import Controller from "@decorators/controller";
import { Get } from "@decorators/request-methods";
import { getRequestParams, getRequestQuery } from "@mangarr/shared";
import { NotFoundError } from "@mangarr/shared/errors";
import { MangaSourceType } from "@mangaClients/shared/types";

@Injectable()
@Controller("/manga")
export default class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get("/new")
  public async getNew(req: Request, res: Response) {
    const source = getRequestQuery(req, "source", "string") as MangaSourceType;
    const newChapters = await this.mangaService.getNewChapters(source);

    if (!newChapters) {
      throw new NotFoundError("No new Chapters found.");
    }
    return res.json(newChapters).status(200).send();
  }

  @Get("/:mangaId")
  public async getInfo(req: Request, res: Response) {
    const mangaId = getRequestParams(req, "mangaId", "string") as string;
    const source = getRequestQuery(req, "source", "string") as MangaSourceType;

    const mangaInfo = await this.mangaService.getInfo(source, mangaId);

    if (!mangaInfo) {
      throw new NotFoundError("Manga not found.");
    }
    return res.status(200).json(mangaInfo).send();
  }
}
