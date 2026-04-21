import express, { Express, json } from "express";
import cookieParser from "cookie-parser";
import { initDB, initImageCache, initRedis } from "@api/database";
import { errorHandler } from "@middleware/error-handler";
import cors from "cors";
import { registerControllers } from "@iocContainer/bootstrap";

export default class App {
  private readonly instance: Express;

  constructor() {
    this.instance = express();
  }

  private async boostrap() {
    await this.initDatabase();
    await this.initRedisClient();
    this.initImageCache();
    this.registerLibraries();
    await this.registerControllers();
    this.registerMiddleware();
  }

  private registerLibraries() {
    if (!this.instance) return;
    this.instance.use(cookieParser());
    this.instance.use(json());
    this.instance.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
      }),
    );
  }

  private registerMiddleware() {
    if (!this.instance) return;
    this.instance.use(errorHandler);
  }

  private async initDatabase() {
    await initDB();
  }

  private async initRedisClient() {
    await initRedis();
  }

  private initImageCache() {
    initImageCache();
  }

  async registerControllers() {
    registerControllers(this.instance);
  }

  public async listen() {
    await this.boostrap();
    this.instance.listen(process.env.PORT, (error) => {
      if (error) console.log(error);
      else {
        console.log(`Listening on ${process.env.PORT}`);
      }
    });
  }
}
