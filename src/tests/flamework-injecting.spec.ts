/// <reference types="@rbxts/testez/globals" />

import { DependencyContainer } from "container";
import { ignite } from "./flamework-test-utils";
import { TestService, Version } from "./test-service";

export = function () {
	const globalContainer = new DependencyContainer();

	beforeAll(() => {
		ignite(() => {
			globalContainer.enableFlameworkResolver();
			globalContainer.register<Version>("1");

			globalContainer.injectIntoFlamework();
		});
	});

	it("should resolve flamework service", () => {
		const testService = globalContainer.resolve<TestService>();
		expect(testService).to.be.ok();
	});

	it("should inject in flamework services", () => {
		const testService = globalContainer.resolve<TestService>();

		expect(testService.dependencyService).to.be.ok();
		expect(testService.dependencyService.something).to.equal(1);

		expect(testService.version).to.equal("1");
	});
};
