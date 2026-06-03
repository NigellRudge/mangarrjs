import type { Request, Response } from "express";

import Controller from "@decorators/controller";
import DiscoverService from "@services/discover-service";
import { Get } from "@decorators/request-methods";
import { GeneralError, getDiscoverFilterFromRequest } from "@mangarr/shared";
import { UseMiddleware } from "@decorators/middleware";
import { authenticateToken } from "@middleware/auth-middleware";

@Controller("/discover")
@UseMiddleware(authenticateToken)
export default class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get("/facets")
  public async getFacets(req: Request, res: Response) {
    const response = await this.discoverService.getFacets();

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }

  @Get("/search")
  public async discover(req: Request, res: Response) {
    const filters = getDiscoverFilterFromRequest(req);
    const response = await this.discoverService.discover(filters);

    if (!response) {
      throw new GeneralError("Something went wrong");
    }
    return res.status(200).json(response).send();
  }
}
