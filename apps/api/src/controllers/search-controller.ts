import type { Request, Response } from "express";

import Controller from "@decorators/controller";
import SearchService from "@services/search-service";
import { Get } from "@decorators/request-methods";
import {
  GeneralError,
  getDiscoverFilterFromRequest,
  getRequestQuery,
  getSearchFilters,
  NotFoundError,
} from "@mangarr/shared";
import { UseMiddleware } from "@decorators/middleware";
import { authenticateToken } from "@middleware/auth-middleware";

@Controller("/search")
@UseMiddleware(authenticateToken)
export default class SearchController {
  constructor(private readonly discoverService: SearchService) {}

  @Get("/facets")
  public async getFacets(req: Request, res: Response) {
    const response = await this.discoverService.getFacets();

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }

  @Get("/discover")
  public async discover(req: Request, res: Response) {
    const filters = getDiscoverFilterFromRequest(req);
    const response = await this.discoverService.discover(filters);

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }

  @Get("/")
  async search(req: Request, res: Response) {
    const query = getRequestQuery(req, "query", "string") as string;
    const searchFilters = getSearchFilters(req);
    if (!query) {
      throw new NotFoundError("Not found");
    }
    const response = await this.discoverService.search(query, {
      page: searchFilters.page,
      pageSize: searchFilters.pageSize,
    });

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }
}
