# 💉 flamework dependency injection toolkit

Library that buffs flamework dependency injection system

# ✒️ Credits
SUMER (discord sumer_real): for creating this library

# 🌠 Install
``npm install @rbxts/flamework-di-toolkit``

# 📚 Documentation

## Inject marker

first thing you need to do is to mark fields you need to inject

```ts
export type Version = string;

export class MyClass {
	@Inject
	public version: Version;
}
```

## DependencyContainer

this used to inject dependencies

```ts
const container = new DependencyContainer();

container.register<Version>("1.0");  // firstly you need to register all dependencies

print(container.resolve<Version>());  // will output -> 1.0

// there two ways to inject into classes

// first way is to inject into constructed class
const myClass = new MyClass();
container.inject(myClass);

print(myClass.version);  // will output -> 1.0

// second way is to directly inject into constructor, this way is better in case that the class will use dependencies inside constructor
container.injectIntoConstructor(MyClass);

const myClass = new MyClass();
print(myClass.version);  // will output -> 1.0

// also you can register factory method
type Car = { name: string };
container.registerFactory<Car>(() => { name: "best car" });

// you can add or set default resolver, so you can modify dependency injection logic in case dependency isn't registered
container.setDefaultResolver((dependency) => {
	return "1";
});

container.setDefaultResolver((dependency) => {
	return "2";
});  // will replace previous default resolver

container.insertDefaultResolver((dependency) => {
	return undefined;
});  // this will not replace previous default resolver and if your default resolver returns undefined it will give a try for previous resolver
```

## work with flamework
```ts
// in default mode container will not inject flamework dependencies
// so you need to manually enable it
container.enableFlameworkResolver();  // this will set default resolver

// you can inject into services and components using this method
// notice that you need to do that before ignite
Flamework.addPath("src/shared");
Flamework.addPath("src/server");

container.injectIntoFlamework();

Flamework.ignite();
```
