class Thingy {
  constructor(private one: string, private two: number) {}
}

type Hey = ConstructorParameters<typeof Thingy>;
