import { Providers, type Provider } from "../../enums/providers.js";
import { AwsGenerator } from "./aws-generator.js";
import { AzureGenerator } from "./azure-generator.js";
import { GcpGenerator } from "./gcp-generator.js";
import type { ProviderGenerator } from "./provider-generator.js";

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
        const generator = this.getGeneratorByProvider(provider);

        for (let i = 0; i < resourceCount; i++) {
            generator.addRandomResource();
        }

        generator.writeToFile({ fileName, directory, format });
    }

    public static getGeneratorByProvider(
        provider: Provider
    ): ProviderGenerator {
        switch (provider) {
            case Providers.Azure:
                return new AzureGenerator();
            case Providers.GCP:
                return new GcpGenerator();
            default:
            case Providers.AWS:
                return new AwsGenerator();
        }
    }
}

export { FileGenerator };
