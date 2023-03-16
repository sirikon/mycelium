// url_test.ts
import {
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "std/testing/asserts.ts";
import { Container } from "./Container.ts";

Deno.test("Container", async (t) => {
  await t.step("can be instantiated", () => {
    new Container();
  });

  await t.step("classes can be registered", () => {
    prepareContainer();
  });

  await t.step(
    "when resolving unregistered classes, an exception is thrown",
    () => {
      const container = new Container();
      assertThrows(
        () => container.resolve(ExampleClass),
        Error,
        "Could not resolve class ExampleClass",
      );
    },
  );

  await t.step(
    "when resolving child unregistered classes, an exception is thrown",
    () => {
      const container = new Container();
      container.register(ExampleClass, [
        ExampleSingleton,
        ExampleCollaboratorA,
        ExampleCollaboratorB,
        ExampleCollaboratorB,
      ]);
      assertThrows(
        () => container.resolve(ExampleClass),
        Error,
        "Could not resolve class ExampleClass",
      );
    },
  );

  await t.step("classes can be registered and resolved", () => {
    const container = prepareContainer({ includeContext: true });
    const instance = container.resolve(ExampleClass);
    assertInstanceOf(instance, ExampleClass);
  });

  await t.step(
    "classes can be registered and resolved in child containers",
    () => {
      const container = prepareContainer({ includeContext: false });
      assertThrows(
        () => container.resolve(ExampleClass),
        Error,
        "Could not resolve class ExampleClass",
      );

      const childContainerA = container.createChild();
      childContainerA.registerInstance(
        ExampleContext,
        new ExampleContext("another text"),
      );
      assertStrictEquals(
        childContainerA.resolve(ExampleClass).saySomething(),
        "another text",
      );
      assertThrows(
        () => container.resolve(ExampleClass),
        Error,
        "Could not resolve class ExampleClass",
      );

      const childContainerB = container.createChild();
      childContainerB.registerInstance(
        ExampleContext,
        new ExampleContext("another text again"),
      );
      assertStrictEquals(
        childContainerB.resolve(ExampleClass).saySomething(),
        "another text again",
      );

      const singletonB = childContainerB.resolve(ExampleSingleton);
      const singletonA = childContainerA.resolve(ExampleSingleton);
      const singleton = container.resolve(ExampleSingleton);
      assertStrictEquals(singleton, singletonA);
      assertStrictEquals(singleton, singletonB);
      assertStrictEquals(singletonA, singletonB);
    },
  );

  await t.step(
    "classes can be resolved multiple times, always returning the same instance",
    () => {
      const container = prepareContainer({ includeContext: true });
      const instanceA = container.resolve(ExampleClass);
      const instanceB = container.resolve(ExampleClass);
      assertInstanceOf(instanceA, ExampleClass);
      assertInstanceOf(instanceB, ExampleClass);
      assertStrictEquals(instanceA, instanceB);
      assertStrictEquals(instanceA.saySomething(), instanceB.saySomething());
      assertStrictEquals(instanceA.a, instanceB.a);
      assertStrictEquals(instanceA.b1, instanceB.b1);
      assertStrictEquals(instanceA.b2, instanceB.b2);
      assertStrictEquals(instanceA.b1, instanceA.b2);
      assertStrictEquals(instanceB.b1, instanceB.b2);
      assertStrictEquals(instanceA.a.b, instanceB.a.b);
    },
  );
});

function prepareContainer(args?: { includeContext?: boolean }) {
  const container = new Container();
  container.register(ExampleSingleton, []);
  container.register(ExampleClass, [
    ExampleSingleton,
    ExampleCollaboratorA,
    ExampleCollaboratorB,
    ExampleCollaboratorB,
  ]);
  container.register(ExampleCollaboratorA, [
    ExampleCollaboratorB,
  ]);
  container.register(ExampleCollaboratorB, [ExampleContext]);
  args?.includeContext && container.registerInstance(
    ExampleContext,
    new ExampleContext("example text"),
  );
  return container;
}

class ExampleClass {
  constructor(
    public singleton: ExampleSingleton,
    public a: ExampleCollaboratorA,
    public b1: ExampleCollaboratorB,
    public b2: ExampleCollaboratorB,
  ) {}
  saySomething() {
    return this.a.saySomethingA();
  }
}

class ExampleSingleton {
  doTheThing() {
    return true;
  }
}

class ExampleCollaboratorA {
  constructor(public b: ExampleCollaboratorB) {}
  saySomethingA() {
    return this.b.saySomethingB();
  }
}

class ExampleCollaboratorB {
  constructor(private ctx: ExampleContext) {}
  saySomethingB() {
    return this.ctx.getText();
  }
}

class ExampleContext {
  constructor(private text: string) {}
  getText() {
    return this.text;
  }
}
