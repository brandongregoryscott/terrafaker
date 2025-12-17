import { TerraformGenerator } from "terraform-generator";
import type { ResourceType } from "../../enums/resource-types.js";
import { ResourceTypes } from "../../enums/resource-types.js";
import {
    randomItem,
    randomMemorableSlug,
    randomTags,
} from "./generator-utils.js";
import { formatTfFileName } from "../string-utils.js";

interface ProviderGeneratorOptions {
    tags?: ProviderGeneratorTags;
}

type ProviderGeneratorTags =
    | Record<string, string>
    /**
     * Tags are randomly generated for each resource
     */
    | "chaos"
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
    public readonly tfg: TerraformGenerator;
    public readonly region: string;
    public readonly tags?: ProviderGeneratorTags;

    public constructor(options?: ProviderGeneratorOptions) {
        this.tfg = new TerraformGenerator();
        this.region = this.randomRegion();
        this.addProvider();
        this.tags = options?.tags;
    }

    /**
     * Adds a block for the provider, and typically the region to be used.
     * This is called automatically by the constructor, so it shouldn't need to be called manually.
     */
    public abstract addProvider(): void;

    public abstract addComputeInstance(): this;

    public abstract addLambdaFunction(): this;

    public abstract randomRegion(): string;

    public addResourceByType(type: ResourceType): this {
        switch (type) {
            case ResourceTypes.LambdaFunction:
                return this.addLambdaFunction();
            default:
            case ResourceTypes.ComputeInstance: {
                return this.addComputeInstance();
            }
        }
    }

    public addRandomResource(): this {
        const type = randomItem(Object.values(ResourceTypes));
        return this.addResourceByType(type);
    }

    public getTags(): Record<string, string> | undefined {
        if (this.tags === "chaos") {
            return randomTags();
        }

        return this.tags;
    }

    public toString(): string {
        const { tf } = this.tfg.generate();
        return tf.trim();
    }

    public writeToFile(options?: WriteToFileOptions): void {
        const { directory, format = true } = options ?? {};
        const fileName = formatTfFileName(
            options?.fileName ?? randomMemorableSlug()
        );
        this.tfg.write({ format, dir: directory, tfFilename: fileName });
    }
}

export type { ProviderGeneratorOptions, ProviderGeneratorTags };
export { ProviderGenerator };
