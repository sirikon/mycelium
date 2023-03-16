import { Clazz } from "./models.ts";
import { Registry } from "./Registry.ts";
import { State } from "./State.ts";

export class Resolver {
  public parent: Resolver | null = null;

  constructor(
    private registry: Registry,
    private state: State,
  ) {}

  public resolve<T>(clazz: Clazz<T>): T | null {
    if (this.parent != null) {
      const instance = this.parent.resolve(clazz);
      if (instance != null) return instance;
    }

    const instance = this.state.getInstance(clazz);
    if (instance != null) return instance;

    return this.createInstance(clazz);
  }

  private createInstance<T>(clazz: Clazz<T>) {
    const blueprint = this.registry.getBlueprint(clazz);
    if (!blueprint) return null;

    const dependenciesInstances: unknown[] = [];
    for (const dependency of blueprint.dependencies) {
      const instance = this.resolve(dependency);
      if (instance == null) {
        return null;
      }
      dependenciesInstances.push(this.resolve(dependency));
    }

    const instance = new blueprint.clazz(...dependenciesInstances);
    this.state.addInstance(clazz, instance);
    return instance;
  }
}
