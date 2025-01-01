import { Modding, Reflect } from "@flamework/core";
import { Constructor } from "@flamework/core/out/utility";

type Constructed<T extends Constructor> = T extends Constructor<infer R> ? R : never;
type RobloxCtorMethod<T extends Constructor> = (
	target: Constructed<T>,
	...args: ConstructorParameters<T>
) => void | undefined | Constructed<T>;

export const ModdingInternals = Modding as never as {};
export const ReflectInternals = Reflect as never as { idToObj: Map<string, object> };

export function modifyConstructor<T extends Constructor>(
	ctor: T,
	createMod: (original: RobloxCtorMethod<T>) => RobloxCtorMethod<T>,
) {
	const robloxCtor = ctor as never as { constructor: RobloxCtorMethod<T> };
	const originalConstructorMethod = robloxCtor.constructor;

	robloxCtor.constructor = createMod(originalConstructorMethod) as never;
}
