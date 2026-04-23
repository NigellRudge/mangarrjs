import Controller from "@decorators/controller";
import { Get } from "@decorators/request-methods";
import type { Request, Response } from "express";
import TrendingService from "@services/trending-service";
import { NotFoundError } from "@mangarr/shared/errors";

@Controller("/trending")
export default class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get("/")
  async getTrendingMangas(req: Request, res: Response) {
    const newChapters = await this.trendingService.getTrendingMangas();

    if (!newChapters) {
      throw new NotFoundError("No new Chapters found.");
    }
    return res.status(200).json(newChapters).send();
  }
}
