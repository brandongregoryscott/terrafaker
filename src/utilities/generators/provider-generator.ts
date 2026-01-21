import type { Map } from "terraform-generator";
import { map, TerraformGenerator } from "terraform-generator";
import type { ResourceType } from "../../enums/resource-types.js";
import { ResourceTypes } from "../../enums/resource-types.js";
import { formatTfFileName } from "../string-utils.js";
import {
    randomItem,
    randomMemorableSlug,
    randomTags,
} from "./generator-utils.js";

interface ProviderGeneratorOptions {
    tags?: ProviderGeneratorTags;
}

type ProviderGeneratorTags =
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
    public readonly region: string;
    public readonly tags?: ProviderGeneratorTags;
    public readonly tfg: TerraformGenerator;
    /**
     * Provider-specific key for `tags` objects.
     * @default tags
     */
    public tagKey: string;

    public constructor(options?: ProviderGeneratorOptions) {
        this.tfg = new TerraformGenerator();
        this.region = this.randomRegion();
        this.addProvider();
        this.tags = options?.tags;
        this.tagKey = "tags";
    }

    public abstract addComputeInstance(): this;

    public abstract addLambdaFunction(): this;

    /**
     * Adds a block for the provider, and typically the region to be used.
     * This is called automatically by the constructor, so it shouldn't need to be called manually.
     */
    public abstract addProvider(): void;

    public abstract randomRegion(): string;

    public addRandomResource(): this {
        const type = randomItem(Object.values(ResourceTypes));
        return this.addResourceByType(type);
    }

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

    public getTags(): Record<string, string> | undefined {
        if (this.tags === "chaos") {
            return randomTags();
        }

        return this.tags;
    }

    /**
     * Constructs the tag object to spread onto a resource, where the key is provider specific
     * (usually `tags` or `labels`) and the value is a `Map` constructed from the object returned from
     * `getTags`.
     */
    public getTagsBlock(): Record<string, Map> | undefined {
        const tags = this.getTags();
        if (tags === undefined) {
            return undefined;
        }

        return { [this.tagKey]: map(tags) };
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
        this.tfg.write({ dir: directory, format, tfFilename: fileName });
    }
}

export type { ProviderGeneratorOptions, ProviderGeneratorTags };
export { ProviderGenerator };
