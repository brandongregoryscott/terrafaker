import type { CloudProvider } from "../../enums/cloud-providers.js";
import type { IacType } from "../../enums/iac-types.js";
import type { ProviderGeneratorOptions } from "./provider-generator.js";
import { CloudProviders } from "../../enums/cloud-providers.js";
import { IacTypes } from "../../enums/iac-types.js";
import { AwsTerraformGenerator } from "./aws-terraform-generator.js";
import { AzureTerraformGenerator } from "./azure-terraform-generator.js";
import { CloudformationGenerator } from "./cloudformation-generator.js";
import { GcpTerraformGenerator } from "./gcp-terraform-generator.js";

interface GeneratorFactoryOptions extends ProviderGeneratorOptions {
    cloudProvider: CloudProvider;
    iacType: IacType | undefined;
}

class GeneratorFactory {
    static get(options: GeneratorFactoryOptions) {
        const { cloudProvider, iacType, ...rest } = options;
        if (iacType === IacTypes.CloudFormation) {
            return new CloudformationGenerator(rest);
        }

        switch (cloudProvider) {
            case CloudProviders.Azure:
                return new AzureTerraformGenerator(options);
            case CloudProviders.GCP:
                return new GcpTerraformGenerator(options);
            default:
            case CloudProviders.AWS:
                return new AwsTerraformGenerator(options);
        }
    }
}

export { GeneratorFactory };
