import { Clazz } from "./models.ts";

export class State {
  private instances: Map<Clazz, unknown> = new Map();

  public addInstance<T>(clazz: Clazz<T>, instance: T) {
    if (this.instances.has(clazz)) {
      throw new Error(`Instance of ${clazz.name} is already registered`);
    }
    this.instances.set(clazz, instance);
  }

  public getInstance<T>(clazz: Clazz<T>) {
    if (this.instances.has(clazz)) {
      return this.instances.get(clazz) as T;
    }
    return null;
  }
}
