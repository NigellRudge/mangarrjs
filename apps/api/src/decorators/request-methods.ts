import "reflect-metadata";

type HttpMethod = "get" | "post" | "put" | "delete";

interface RouteDefinition {
  path: string;
  requestMethod: HttpMethod;
  methodName: string;
}

export function createMethodDecorator(method: HttpMethod) {
  return (path: string = ""): MethodDecorator => {
    return (target, propertyKey: string | symbol) => {
      const routes: RouteDefinition[] =
        Reflect.getMetadata("routes", target.constructor) || [];
      routes.push({
        requestMethod: method,
        path,
        methodName: propertyKey as string,
      });
      Reflect.defineMetadata("routes", routes, target.constructor);
    };
  };
}

export const Get = createMethodDecorator("get");
export const Post = createMethodDecorator("post");
export const Put = createMethodDecorator("put");
export const Delete = createMethodDecorator("delete");
