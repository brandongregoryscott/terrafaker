import { type Provider } from "../../enums/providers.js";
import { randomProvider } from "./generator-utils.js";
import { ProviderGeneratorFactory } from "./provider-generator-factory.js";
import type { ProviderGeneratorOptions } from "./provider-generator.js";

interface GenerateOptions extends ProviderGeneratorOptions {
    provider?: Provider;
    directory?: string;
    fileName?: string;
    format?: boolean;
    resourceCount?: number;
}

class FileGenerator {
    public static generate(options: GenerateOptions) {
        const {
            provider = randomProvider(),
            resourceCount = 3,
            fileName,
            directory,
            format,
            tags,
        } = options;
        const generator = ProviderGeneratorFactory.get(provider, { tags });

        for (let i = 0; i < resourceCount; i++) {
            generator.addRandomResource();
        }

        generator.writeToFile({ fileName, directory, format });
    }
}

export { FileGenerator };
