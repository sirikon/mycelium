type Constructor<T = unknown> = new (...args: any) => T;
type Provider<T = unknown> = (c: Resolver) => T;

export class Resolver {
  private parent: Resolver | null = null;
  private providers: Map<Constructor, Provider> = new Map();
  private instances: Map<Constructor, unknown> = new Map();

  public resolve<T>(ctor: Constructor<T>) {
    const instance = this.getInstance(ctor);
    if (instance) return instance;
    return this.createInstance(ctor);
  }

  public createChildContainer() {
    const child = new Resolver();
    child.parent = this;
    return child;
  }

  private createInstance<T>(ctor: Constructor<T>) {
    const provider = this.getProvider(ctor);
    if (!provider) {
      throw new Error(`Constructor ${ctor.name} has not been registered`);
    }
    const instance = provider(this);
    this.instances.set(ctor, instance);
    return instance;
  }

  private getInstance<T>(ctor: Constructor<T>): T | null {
    if (this.instances.has(ctor)) {
      return this.instances.get(ctor) as T;
    }
    return this.parent?.getInstance(ctor) || null;
  }

  private getProvider<T>(ctor: Constructor<T>): Provider<T> | null {
    if (this.providers.has(ctor)) {
      return this.providers.get(ctor) as Provider<T>;
    }
    return this.parent?.getProvider(ctor) || null;
  }
}
