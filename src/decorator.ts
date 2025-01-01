import { Modding, Reflect } from "@flamework/core";

/** @metadata reflect flamework:type */
export function Inject(target: object, propertyKey: string) {
	const propertyType = Reflect.getMetadata<string>(target, "flamework:type", propertyKey);
	assert(propertyType !== undefined, `Property type is undefined, property "${propertyKey}" can't be injected.`);

	Reflect.defineMetadata(target, "mb:inject", propertyType, propertyKey);
}
