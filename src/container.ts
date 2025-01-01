import { Dependency, Modding, Reflect } from "@flamework/core";
import { Constructor, isConstructor } from "@flamework/core/out/utility";
import { modifyConstructor, ReflectInternals } from "helpers";

export type IntrinsicSymbolId<T> = Modding.Intrinsic<"symbol-id", [T], string>;

export class DependencyContainer {
	private dependencies = new Map<string, () => unknown>();
	private defaultResolver?: (dependency: string) => unknown;

	private createInjectorConstructor = (original: Callback) => {
		return (target: object, ...args: unknown[]) => {
			this.inject(target);
			return original(target, ...args);
		};
	};

	public setDefaultResolver(resolver: (dependency: string) => unknown) {
		this.defaultResolver = resolver;
	}

	public insertDefaultResolver(resolver: (dependency: string) => unknown) {
		const previousResolver = this.defaultResolver;

		this.setDefaultResolver((dependency) => {
			const result = resolver(dependency);
			return result ?? previousResolver?.(dependency);
		});
	}

	/** @metadata macro */
	public registerFactory<T>(factory: () => T, dependency?: IntrinsicSymbolId<T>) {
		assert(dependency, "Failed to get dependency id, looks like flamework bug.");
		this.dependencies.set(dependency, factory);
	}

	/** @metadata macro */
	public register<T>(instance: T, dependency?: IntrinsicSymbolId<T>) {
		assert(dependency, "Failed to get dependency id, looks like flamework bug.");
		this.dependencies.set(dependency, () => instance);
	}

	/** @metadata macro */
	public resolve<T>(dependency?: IntrinsicSymbolId<T>): T {
		assert(dependency, "Failed to get dependency id, looks like flamework bug.");
		const resolver = this.dependencies.get(dependency);

		if (resolver === undefined && this.defaultResolver) {
			const resolvedDependency = this.defaultResolver(dependency as never);
			assert(resolvedDependency !== undefined, `Failed to get dependency "${dependency}", it's not registered.`);

			return resolvedDependency as T;
		}

		assert(resolver, `Failed to get dependency "${dependency}", it's not registered.`);

		return resolver() as T;
	}

	public inject(target: object) {
		Reflect.getProperties(target).forEach((property) => {
			const injectType = Reflect.getMetadata<string>(target, "mb:inject", property);

			if (injectType !== undefined) {
				(target as Record<never, never>)[property as never] = this.resolve(injectType as never);
			}
		});
	}

	public injectIntoConstructor(target: Constructor) {
		modifyConstructor(target, this.createInjectorConstructor);
	}

	public enableFlameworkResolver() {
		this.setDefaultResolver((dependency) => {
			return Dependency(dependency as never);
		});
	}

	public injectIntoFlamework() {
		ReflectInternals.idToObj.forEach((target) => {
			const isSingleton = Reflect.getMetadata<boolean>(target, "flamework:singleton") ?? false;
			const isComponent = Modding.getDecorator(target, undefined, "$c:components@Component") !== undefined;

			if (!isSingleton && !isComponent) return;
			if (Reflect.getMetadata<boolean>(target, "flamework:optional")) return;
			if (!isConstructor(target)) return;

			this.injectIntoConstructor(target);
		});
	}
}
