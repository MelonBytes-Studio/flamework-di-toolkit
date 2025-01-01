/// <reference types="@rbxts/testez/globals" />

import { DependencyContainer } from "container";
import { Inject } from "decorator";

interface Version {
	id: number;
}

export = function () {
	it("register & resolve", () => {
		const container = new DependencyContainer();

		container.register<Version>({ id: 1 });
		expect(container.resolve<Version>().id).to.equal(1);
	});

	it("inject", () => {
		const container = new DependencyContainer();
		container.register<Version>({ id: 1 });

		class Test {
			@Inject
			public version!: Version;
		}

		const test = new Test();
		container.inject(test);

		expect(test.version.id).to.equal(1);
	});

	it("inject into constructor", () => {
		const container = new DependencyContainer();
		container.register<Version>({ id: 1 });

		class Test {
			@Inject
			public version!: Version;
		}

		container.injectIntoConstructor(Test);

		const test = new Test();
		expect(test.version.id).to.equal(1);
	});

	it("try resolve invalid dependency", () => {
		const container = new DependencyContainer();

		expect(() => container.resolve<Version>()).to.throw();
	});

	it("set default resolver", () => {
		const container = new DependencyContainer();

		container.setDefaultResolver(() => {
			return 1;
		});

		expect(container.resolve<Version>()).to.equal(1);

		container.setDefaultResolver(() => {
			return 2;
		});

		expect(container.resolve<Version>()).to.equal(2);
	});

	it("insert default resolver", () => {
		const container = new DependencyContainer();
		let useFirst = true;

		container.insertDefaultResolver(() => {
			return useFirst ? 1 : undefined;
		});

		container.insertDefaultResolver(() => {
			return useFirst === false ? 2 : undefined;
		});

		expect(container.resolve<Version>()).to.equal(1);
		useFirst = false;
		expect(container.resolve<Version>()).to.equal(2);
	});
};
