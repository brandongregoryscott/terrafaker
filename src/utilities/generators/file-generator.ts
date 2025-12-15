import { type Provider } from "../../enums/providers.js";
import { ProviderGeneratorFactory } from "./provider-generator-factory.js";

interface GenerateFileByProviderOptions {
    provider: Provider;
    directory?: string;
    fileName?: string;
    format?: boolean;
    resourceCount?: number;
}

class FileGenerator {
    public static generateFileByProvider(
        options: GenerateFileByProviderOptions
    ) {
        const {
            provider,
            resourceCount = 3,
            fileName,
            directory,
            format,
        } = options;
        const generator = ProviderGeneratorFactory.get(provider);

        for (let i = 0; i < resourceCount; i++) {
            generator.addRandomResource();
        }

        generator.writeToFile({ fileName, directory, format });
    }
}

export { FileGenerator };
