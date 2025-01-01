import { Flamework } from "@flamework/core";

export let isIgnited = false;

export function ignite(beforeIgnite: () => void) {
	if (isIgnited) return;

	isIgnited = true;
	Flamework.addPaths("src/./");

	beforeIgnite();

	Flamework.ignite();
}
