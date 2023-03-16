import { Blueprint, Clazz } from "./models.ts";

export class Container {
  private parent: Container | null = null;

  private blueprints: Map<Clazz, Blueprint> = new Map();
  private instances: Map<Clazz, unknown> = new Map();

  public register<T, TC extends Clazz<T>>(
    clazz: Blueprint<TC>["clazz"],
    dependencies: Blueprint<TC>["dependencies"],
  ) {
    if (this.blueprints.has(clazz)) {
      throw new Error(`Class ${clazz.name} is already registered`);
    }
    this.blueprints.set(clazz, { clazz, dependencies });
  }

  public registerInstance<T, TC extends Clazz<T>>(clazz: TC, instance: T) {
    this.instances.set(clazz, instance);
  }

  public resolve<T>(clazz: Clazz<T>) {
    const result = this.resolveInternal(clazz);
    if (result == null) {
      throw new Error(`Could not resolve class ${clazz.name}`);
    }
    return result;
  }

  private resolveInternal<T>(clazz: Clazz<T>): T | null {
    if (this.parent != null) {
      const instance = this.parent.resolveInternal(clazz);
      if (instance != null) {
        return instance;
      }
    }

    const instance = this.instances.get(clazz);
    if (instance != null) {
      return instance as T;
    }

    return this.createInstance(clazz);
  }

  private createInstance<T>(clazz: Clazz<T>) {
    const blueprint = this.getBlueprint(clazz);
    if (!blueprint) {
      return null;
    }

    const dependenciesInstances: unknown[] = [];
    for (const dependency of blueprint.dependencies) {
      const instance = this.resolveInternal(dependency);
      if (instance == null) {
        return null;
      }
      dependenciesInstances.push(instance);
    }

    const instance = new blueprint.clazz(...dependenciesInstances);
    this.instances.set(clazz, instance);
    return instance;
  }

  private getBlueprint<T>(clazz: Clazz<T>): Blueprint<Clazz<T>> | null {
    if (this.parent != null) {
      const blueprint = this.parent.getBlueprint(clazz);
      if (blueprint != null) {
        return blueprint;
      }
    }
    return this.blueprints.get(clazz) || null;
  }

  public createChild() {
    const container = new Container();
    container.parent = this;
    return container;
  }
}
