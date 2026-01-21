import type { ProviderGeneratorOptions } from "./provider-generator.js";
import { type Provider } from "../../enums/providers.js";
import { randomProvider } from "./generator-utils.js";
import { ProviderGeneratorFactory } from "./provider-generator-factory.js";

interface GenerateOptions extends ProviderGeneratorOptions {
    directory?: string;
    fileName?: string;
    format?: boolean;
    provider?: Provider;
    resourceCount?: number;
}

class FileGenerator {
    public static generate(options: GenerateOptions) {
        const {
            directory,
            fileName,
            format,
            provider = randomProvider(),
            resourceCount = 3,
            tags,
        } = options;
        const generator = ProviderGeneratorFactory.get(provider, { tags });

        for (let i = 0; i < resourceCount; i++) {
            generator.addRandomResource();
        }

        generator.writeToFile({ directory, fileName, format });
    }
}

export { FileGenerator };
