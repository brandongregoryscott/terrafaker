import type { Provider } from "../../enums/providers.js";
import type { ProviderGeneratorOptions } from "./provider-generator.js";
import { Providers } from "../../enums/providers.js";
import { AwsGenerator } from "./aws-generator.js";
import { AzureGenerator } from "./azure-generator.js";
import { GcpGenerator } from "./gcp-generator.js";

class ProviderGeneratorFactory {
    public static get(provider: Provider, options?: ProviderGeneratorOptions) {
        switch (provider) {
            case Providers.Azure:
                return new AzureGenerator(options);
            case Providers.GCP:
                return new GcpGenerator(options);
            default:
            case Providers.AWS:
                return new AwsGenerator(options);
        }
    }
}

export { ProviderGeneratorFactory };
