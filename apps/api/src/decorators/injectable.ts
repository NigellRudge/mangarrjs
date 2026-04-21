import { iocContainer } from "@iocContainer/ioc-container";

export default function Injectable(injectableOptions?: {
  singleton?: boolean;
}): ClassDecorator {
  return function (target: any) {
    iocContainer.register(target, injectableOptions);
    Reflect.defineMetadata("custom:injectable", true, target);
  };
}
