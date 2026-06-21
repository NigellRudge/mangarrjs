import { Router } from "express";
import { iocContainer } from "@iocContainer/ioc-container";

import "@controllers/manga-controller";
import "@controllers/auth-controller";
import "@controllers/user-controller";
import "@controllers/image-controller";
import "@controllers/trending-controller";
import "@controllers/search-controller";

export function registerControllers(app: Router) {
  const controllers = Reflect.getMetadata("controllers", global) || [];

  controllers.forEach((ControllerClass: any) => {
    const instance = iocContainer.resolve(ControllerClass);
    const prefix = Reflect.getMetadata("prefix", ControllerClass) || "";
    const routes = Reflect.getMetadata("routes", ControllerClass) || [];

    const classMiddlewares =
      Reflect.getMetadata("class:middlewares", ControllerClass) || [];

    const methodMiddlewaresMap =
      Reflect.getMetadata("method:middlewares", ControllerClass) || {};

    routes.forEach((route: any) => {
      const handler = (req: any, res: any, next: any) => {
        // @ts-ignore
        return instance[route.methodName](req, res, next);
      };

      const methodMiddlewares = methodMiddlewaresMap[route.methodName] || [];

      // @ts-ignore
      app[route.requestMethod](
        `${prefix}${route.path}`,
        ...classMiddlewares,
        ...methodMiddlewares,
        handler,
      );
    });
  });
}
