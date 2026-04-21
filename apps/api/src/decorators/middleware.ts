import "reflect-metadata";

export function UseMiddleware(...middlewares: any[]) {
  return (target: any, propertyKey?: string) => {
    if (propertyKey) {
      const existing =
        Reflect.getMetadata("method:middlewares", target.constructor) || {};

      existing[propertyKey] = [
        ...(existing[propertyKey] || []),
        ...middlewares,
      ];

      Reflect.defineMetadata(
        "method:middlewares",
        existing,
        target.constructor,
      );
    } else {
      const existing = Reflect.getMetadata("class:middlewares", target) || [];

      Reflect.defineMetadata(
        "class:middlewares",
        [...existing, ...middlewares],
        target,
      );
    }
  };
}
