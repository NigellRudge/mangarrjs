import type { Request, Response } from "express";
import { GeneralError, NotFoundError } from "@mangarr/shared/errors";
import SearchService from "@services/search-service";
import {
  getRequestQuery,
  getSearchFilters,
  MangaSourceType,
} from "@mangarr/shared";
import Injectable from "@decorators//injectable";
import Controller from "@decorators/controller";
import { Get } from "@decorators/request-methods";
import { UseMiddleware } from "@decorators/middleware";
import { authenticateToken } from "@middleware/auth-middleware";

@Injectable()
@UseMiddleware(authenticateToken)
@Controller("/search")
export default class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("/")
  async search(req: Request, res: Response) {
    const query = getRequestQuery(req, "query", "string") as string;
    const searchFilters = getSearchFilters(req);
    if (!query) {
      throw new NotFoundError("Not found");
    }
    const response = await this.searchService.search(query, searchFilters);

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }

  @Get("/quick")
  async quicSearch(req: Request, res: Response) {
    const query = getRequestQuery(req, "query", "string") as string;
    const source = getRequestQuery(req, "source", "string") as MangaSourceType;
    if (!query) {
      throw new NotFoundError("Not found");
    }
    const response = await this.searchService.quickSearch(source, query);
    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }

  @Get("/genres")
  async getGenresForSource(req: Request, res: Response) {
    const source = getRequestQuery(req, "source", "string") as MangaSourceType;
    if (!source) {
      throw new NotFoundError("No Source provided");
    }
    const response = await this.searchService.getGenres(source);
    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }
}
