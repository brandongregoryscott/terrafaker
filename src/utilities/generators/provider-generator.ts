import type { ResourceType } from "../../enums/resource-types.js";
import { ResourceTypes } from "../../enums/resource-types.js";
import { Random } from "../random.js";

interface ProviderGeneratorOptions {
    /**
     * Tag configuration to be generated with each generated resource
     */
    tags?: GeneratorTagsOption;
}

type GeneratorTagsOption =
    | "chaos"
    /**
     * Tags are randomly generated for each resource
     */
    | Record<string, string>
    /**
     * No tags will be added to any resource
     */
    | undefined;

interface WriteToFileOptions {
    directory?: string;
    fileName?: string;
    format?: boolean;
}

abstract class ProviderGenerator {
    readonly region: string;
    readonly tags?: GeneratorTagsOption;

    constructor(options?: ProviderGeneratorOptions) {
        this.region = this.randomRegion();
        this.tags = options?.tags;
    }

    abstract addComputeInstance(): this;

    abstract addLambdaFunction(): this;

    abstract randomRegion(): string;

    abstract toString(): string;

    abstract writeToFile(options?: WriteToFileOptions): void;

    addRandomResource(): this {
        const type = Random.item(Object.values(ResourceTypes));
        return this.addResourceByType(type);
    }

    addRandomResources(count: number): this {
        for (let i = 0; i < count; i++) {
            this.addRandomResource();
        }

        return this;
    }

    addResourceByType(type: ResourceType): this {
        switch (type) {
            case ResourceTypes.LambdaFunction:
                return this.addLambdaFunction();
            default:
            case ResourceTypes.ComputeInstance: {
                return this.addComputeInstance();
            }
        }
    }

    getTags(): Record<string, string> | undefined {
        if (this.tags === "chaos") {
            return Random.tags();
        }

        return this.tags;
    }
}

export type {
    GeneratorTagsOption,
    ProviderGeneratorOptions,
    WriteToFileOptions,
};
export { ProviderGenerator };
