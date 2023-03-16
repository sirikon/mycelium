import { Blueprint, Clazz } from "./models.ts";

export class Registry {
  private blueprints: Map<Clazz, Blueprint> = new Map();

  public addBlueprint<T extends Clazz>(blueprint: Blueprint<T>) {
    if (this.blueprints.has(blueprint.clazz)) {
      throw new Error(`Class ${blueprint.clazz.name} is already registered`);
    }
    this.blueprints.set(blueprint.clazz, blueprint);
  }

  public getBlueprint<T extends Clazz>(clazz: T) {
    const blueprint = this.blueprints.get(clazz);
    if (blueprint != null) return blueprint as Blueprint<T>;
    return null;
  }
}
