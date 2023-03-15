type Clazz<T = any> = abstract new (...args: any) => T;

export type Indices<T> = Exclude<keyof T, keyof any[]>;

type Dependencies<T extends Clazz> =
  & {
    [P in Indices<ConstructorParameters<T>>]: Clazz<
      ConstructorParameters<T>[P]
    >;
  }
  & { length: ConstructorParameters<T>["length"] }
  & any[];

type Blueprint<
  T extends Clazz = any,
> = {
  clazz: T;
  dependencies: Dependencies<T>;
};

class DepA {
  constructor(private peter: number) {}
  // doThing() {}
}
class DepB {
  constructor(private peter: number) {}
}

class Thingy {
  constructor(private one: DepA, private two: DepB) {}
}

type Hey = Blueprint<typeof Thingy>;

export class Registry {
  private registeredConstructors: Set<Clazz> = new Set();

  private blueprints: Map<Clazz, Blueprint> = new Map();
  private instances: Map<Clazz, unknown> = new Map();

  public register<T extends Clazz>(
    clazz: T,
    dependencies: Blueprint<T>["dependencies"],
  ) {
    // if (this.registeredConstructors.has(ctor)) {
    //   throw new Error(`Constructor ${ctor.name} is already registered`);
    // }
    // this.providers.set(ctor, provider);
    // this.registeredConstructors.add(ctor);
  }

  // public registerInstance<T>(ctor: Clazz<T>, instance: T) {
  //   if (this.instances.has(ctor)) {
  //     throw new Error(`Instance of ${ctor.name} already exists`);
  //   }
  //   this.instances.set(ctor, instance);
  // }
}

const registry = new Registry();

registry.register(Thingy, [DepB, DepB]);
