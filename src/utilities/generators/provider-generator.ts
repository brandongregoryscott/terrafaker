import { TerraformGenerator } from "terraform-generator";
import type { ResourceType } from "../../enums/resource-types.js";
import { ResourceTypes } from "../../enums/resource-types.js";
import { randomItem, randomMemorableSlug } from "./generator-utils.js";
import { formatTfFileName } from "../string-utils.js";

interface WriteToFileOptions {
    directory?: string;
    fileName?: string;
    format?: boolean;
}

abstract class ProviderGenerator {
    public readonly tfg: TerraformGenerator;

    public constructor() {
        this.tfg = new TerraformGenerator();
        this.addProvider();
    }

    /**
     * Adds a block for the provider, and typically the region to be used.
     * This is called automatically by the constructor, so it shouldn't need to be called manually.
     */
    public abstract addProvider(): void;

    public abstract addComputeInstance(): this;

    public abstract addLambdaFunction(): this;

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

export { ProviderGenerator };
