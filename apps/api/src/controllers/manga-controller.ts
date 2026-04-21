import { Request, Response } from "express";
import MangaService from "@services/manga-service";
import Injectable from "@decorators/injectable";
import Controller from "@decorators/controller";
import { Get } from "@decorators/request-methods";
import { getRequestParams, getRequestQuery } from "@utils/request-utils";
import NotFoundError from "@errors/not-found-error";
import { MangaSourceType } from "@mangaClients/shared/types";
import { UseMiddleware } from "@decorators/middleware";
import { authenticateToken } from "@middleware/auth-middleware";

@Injectable()
// @UseMiddleware(authenticateToken)
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
    return res.status(200).json(newChapters).send();
  }

  @Get("/:mangaId")
  public async getInfo(req: Request, res: Response) {
    const mangaId = getRequestParams(req, "mangaId", "string") as string;
    const source = getRequestQuery(req, "source", "string") as MangaSourceType;

    console.log("--------------", mangaId, source);
    const mangaInfo = await this.mangaService.getInfo(source, mangaId);

    if (!mangaInfo) {
      throw new NotFoundError("Manga not found.");
    }
    return res.status(200).json(mangaInfo).send();
  }
}
