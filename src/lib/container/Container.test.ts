// url_test.ts
import { assertInstanceOf, assertStrictEquals } from "std/testing/asserts.ts";
import { Container } from "./Container.ts";

Deno.test("Container", async (t) => {
  await t.step("can be instantiated", () => {
    new Container();
  });

  await t.step("classes can be registered", () => {
    const container = new Container();
    container.register(ExampleClass, [
      ExampleCollaboratorA,
    ]);
  });

  await t.step("classes can be registered and resolved", () => {
    const container = new Container();
    container.register(ExampleClass, [
      ExampleCollaboratorA,
    ]);
    const instance = container.resolve(ExampleClass);
    assertInstanceOf(instance, ExampleClass);
  });

  await t.step(
    "classes can be resolved multiple times, always returning the same instance",
    () => {
      const container = new Container();
      container.register(ExampleClass, [
        ExampleCollaboratorA,
      ]);
      const instanceA = container.resolve(ExampleClass);
      const instanceB = container.resolve(ExampleClass);
      assertInstanceOf(instanceA, ExampleClass);
      assertInstanceOf(instanceB, ExampleClass);
      assertStrictEquals(instanceA, instanceB);

      assertStrictEquals(instanceA.saySomething(), instanceB.saySomething());
    },
  );
});

class ExampleClass {
  constructor(
    private a: ExampleCollaboratorA,
  ) {}
  saySomething() {
    return this.a.saySomethingA();
  }
}

class ExampleCollaboratorA {
  constructor(private b: ExampleCollaboratorB) {}
  saySomethingA() {
    return this.b.saySomethingB();
  }
}

class ExampleCollaboratorB {
  constructor() {}
  saySomethingB() {
    return "example text";
  }
}

// const url = new URL("./foo.js", "https://deno.land/");
// assertEquals(url.href, "https://deno.land/foo.js");
