import "reflect-metadata";

export default function Controller(prefix: string = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);
    const controllers = Reflect.getMetadata("controllers", global) || [];
    controllers.push(target);
    Reflect.defineMetadata("controllers", controllers, global);
  };
}
