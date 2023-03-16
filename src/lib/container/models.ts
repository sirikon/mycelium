// deno-lint-ignore-file no-explicit-any

export type Clazz<T = any> = new (...args: any) => T;
export type Indices<T> = Exclude<keyof T, keyof any[]>;

export type Dependencies<T extends Clazz> =
  ConstructorParameters<T>["length"] extends 0 ? []
    : 
      & {
        [P in Indices<ConstructorParameters<T>>]: Clazz<
          ConstructorParameters<T>[P]
        >;
      }
      & { length: ConstructorParameters<T>["length"] }
      & any[];

export type Blueprint<
  T extends Clazz = any,
> = {
  clazz: T;
  dependencies: Dependencies<T>;
};
