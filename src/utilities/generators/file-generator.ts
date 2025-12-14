import { type Provider } from "../../enums/providers.js";
import { ProviderGenerator } from "./provider-generator.js";

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
        const generator = ProviderGenerator.get(provider);

        for (let i = 0; i < resourceCount; i++) {
            generator.addRandomResource();
        }

        generator.writeToFile({ fileName, directory, format });
    }
}

export { FileGenerator };
