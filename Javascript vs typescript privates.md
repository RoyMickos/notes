Javascript can denote private class members with hashtag:
```js
class Person {
  #name;
  constructor(name) {
    this.#name = name;
  }
  getName() {
    return this.#name;
  }
}
```

Typescipt has `private` modifier
```ts
class Person {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
```

The difference is that typescript private members are checked at compile time, but not enforced at runtime. Javascript privates are enforced at runtime. A common hack in test code is to cast a typescript variable to `any` in order to access the private members:

```ts
const person = new Person("James B");
const name = (person as any).name;
```
This facility is lost when converting this to using javascript privates.
You can type javascript private members like so:
```ts
class Person {
  #name: string; // Private member with explicit type
  #age: number;  // Another private member

  constructor(name: string, age: number) {
    this.#name = name;
    this.#age = age;
  }

  getName(): string {
    return this.#name;
  }

  getAge(): number {
    return this.#age;
  }

  setAge(age: number): void {
    if (age < 0) {
      throw new Error("Age cannot be negative");
    }
    this.#age = age;
  }
}
```