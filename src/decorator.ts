import { Modding, Reflect } from "@flamework/core";

/** @metadata flamework:type */
export const Inject = Modding.createDecorator("Property", (descriptor) => {
	const propertyType = Reflect.getMetadata<string>(descriptor.object, "flamework:type", descriptor.property);

	assert(
		propertyType !== undefined,
		`Property type is undefined, property "${descriptor.property}" can't be injected.`,
	);

	Reflect.defineMetadata(descriptor.object, "mb:inject", propertyType, descriptor.property);
});
