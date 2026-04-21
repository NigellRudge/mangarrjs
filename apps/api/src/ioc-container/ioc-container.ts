export type Constructor<T = any> = new (...args: any[]) => T;

type ProviderOptions = {
  singleton?: boolean;
};

export class IocContainer {
  private providers = new Map<Constructor, ProviderOptions>();
  private singletons = new Map<Constructor, any>();

  register(target: Constructor, options: ProviderOptions = {}) {
    this.providers.set(target, options);
  }

  resolve<T>(target: Constructor<T>): T {
    const options = this.providers.get(target);

    const isSingleton = options?.singleton ?? false;

    if (isSingleton && this.singletons.has(target)) {
      return this.singletons.get(target);
    }

    const paramTypes: Constructor[] =
      Reflect.getMetadata("design:paramtypes", target) || [];

    const injections = paramTypes.map((param) => this.resolve(param));

    const instance = new target(...injections);

    if (isSingleton) {
      this.singletons.set(target, instance);
    }

    return instance;
  }
}

export const iocContainer = new IocContainer();
