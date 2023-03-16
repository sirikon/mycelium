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

  public resolve<T>(clazz: Clazz<T>) {
    return this.resolver.resolve(clazz);
  }
}
