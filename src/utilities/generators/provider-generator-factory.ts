import type { Provider } from "../../enums/providers.js";
import { Providers } from "../../enums/providers.js";
import { AwsGenerator } from "./aws-generator.js";
import { AzureGenerator } from "./azure-generator.js";
import { GcpGenerator } from "./gcp-generator.js";

class ProviderGeneratorFactory {
    public static get(provider: Provider) {
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

export { ProviderGeneratorFactory };
