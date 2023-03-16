import { Blueprint, Clazz } from "./models.ts";
import { Registry } from "./Registry.ts";
import { Resolver } from "./Resolver.ts";
import { State } from "./State.ts";

export class Container {
  private registry: Registry;
  private state: State;
  private resolver: Resolver;

  constructor() {
    this.registry = new Registry();
    this.state = new State();
    this.resolver = new Resolver(this.registry, this.state);
  }

  public register<T, TC extends Clazz<T>>(
    clazz: Blueprint<TC>["clazz"],
    dependencies: Blueprint<TC>["dependencies"],
  ) {
    this.registry.addBlueprint({ clazz, dependencies });
  }

  public registerInstance<T, TC extends Clazz<T>>(clazz: TC, instance: T) {
    this.state.addInstance(clazz, instance);
  }

  public resolve<T>(clazz: Clazz<T>) {
    const result = this.resolver.resolve(clazz);
    if (result == null) {
      throw new Error(`Could not resolve class ${clazz.name}`);
    }
    return result;
  }

  public createChild() {
    const container = new Container();
    container.registry = new Registry();
    container.state = new State();
    container.resolver = new Resolver(
      container.registry,
      container.state,
    );
    container.resolver.parent = this.resolver;
    return container;
  }
}
