import { Service } from "@flamework/core";
import { Inject } from "decorator";
import { DependencyService } from "./dependency-service";

export type Version = string;

@Service()
export class TestService {
	@Inject()
	public dependencyService!: DependencyService;

	@Inject()
	public version!: Version;
}
