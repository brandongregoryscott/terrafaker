import type { CloudProvider } from "../../enums/cloud-providers.js";
import type { IacType } from "../../enums/iac-types.js";
import type { ProviderGeneratorOptions } from "./provider-generator.js";
import { IacTypes } from "../../enums/iac-types.js";
import { Random } from "../random.js";
import { GeneratorFactory } from "./generator-factory.js";

interface FileGeneratorOptions extends ProviderGeneratorOptions {
    /**
     * Provider to generate a file for. If not provided, a random provider will be used.
     */
    cloudProvider?: CloudProvider;

    /**
     * Directory to generate the file(s) in
     */
    directory?: string;

    /**
     * Name of the generated file. A valid file extension for the iacType will be appended if not provided.
     */
    fileName?: string;

    /**
     * Whether the file(s) should be formatted. Requires the `terraform` CLI to be installed for formatting Terraform files.
     */
    format?: boolean;

    /**
     * Infrastructure-as-code type to generate
     */
    iacType?: IacType;

    /**
     * Number of resources per file to generate
     */
    resourceCount?: number;
}

class FileGenerator {
    static generate(options: FileGeneratorOptions) {
        const {
            cloudProvider = Random.cloudProvider(),
            directory,
            fileName,
            format,
            iacType = IacTypes.Terraform,
            resourceCount = 3,
            tags,
        } = options;

        GeneratorFactory.get({
            cloudProvider,
            iacType,
            tags,
        })
            .addRandomResources(resourceCount)
            .writeToFile({ directory, fileName, format });
    }
}

export type { FileGeneratorOptions };
export { FileGenerator };
