import type { Map } from "terraform-generator";
import {
    map,
    TerraformGenerator as TfgTerraformGenerator,
} from "terraform-generator";
import type {
    ProviderGeneratorOptions,
    WriteToFileOptions,
} from "./provider-generator.js";
import { IacTypes } from "../../enums/iac-types.js";
import { Random } from "../random.js";
import { StringUtils } from "../string-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

abstract class TerraformGenerator extends ProviderGenerator {
    readonly tfg: TfgTerraformGenerator;
    /**
     * Provider-specific key for `tags` objects.
     * @default tags
     */
    tagKey: string;

    constructor(options?: ProviderGeneratorOptions) {
        super(options);
        this.tfg = new TfgTerraformGenerator();
        this.addProvider();
        this.tagKey = "tags";
    }

    /**
     * Adds a block for the provider, and typically the region to be used.
     * This is called automatically by the constructor, so it shouldn't need to be called manually.
     */
    abstract addProvider(): void;

    /**
     * Constructs the tag object to spread onto a resource, where the key is provider specific
     * (usually `tags` or `labels`) and the value is a `Map` constructed from the object returned from
     * `getTags`.
     */
    getTagsBlock(): Record<string, Map> | undefined {
        const tags = this.getTags();
        if (tags === undefined) {
            return undefined;
        }

        return { [this.tagKey]: map(tags) };
    }

    toString(): string {
        const { tf } = this.tfg.generate();
        return tf.trim();
    }

    writeToFile(options?: WriteToFileOptions): void {
        const { directory, format = true } = options ?? {};
        const fileName = StringUtils.formatFileName({
            fileName: options?.fileName ?? Random.snakeSlug(),
            iacType: IacTypes.Terraform,
        });
        this.tfg.write({ dir: directory, format, tfFilename: fileName });
    }
}

export { TerraformGenerator };
