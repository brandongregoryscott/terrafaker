import { AWS_INSTANCE_TYPES } from "../../constants/aws.js";
import { AZURE_LAMBDA_RUNTIMES, AZURE_REGIONS } from "../../constants/azure.js";
import {
    randomEnvironmentTag,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
    randomServiceTag,
} from "./generator-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

const AzureResourceType = {
    ComputeInstance: "azurerm_linux_virtual_machine",
    LambdaFunction: "azurerm_linux_function_app",
} as const;

class AzureGenerator extends ProviderGenerator {
    public addProvider(): void {
        const region = randomItem(AZURE_REGIONS);
        this.tfg.provider("azurerm", { region });
    }

    public addComputeInstance(): this {
        const name = randomMemorableSlug();
        const environment = randomEnvironmentTag();
        const service = randomServiceTag();
        const instanceType = randomItem(AWS_INSTANCE_TYPES);

        this.tfg.resource(AzureResourceType.ComputeInstance, name, {
            size: instanceType,
            tags: { name, environment, service },
        });

        return this;
    }

    public addLambdaFunction(): this {
        const name = randomMemorableSlug();
        const environment = randomEnvironmentTag();
        const service = randomServiceTag();
        const runtime = randomItem(AZURE_LAMBDA_RUNTIMES);
        // There's a lot of different configurations listed, so just guessing here.
        // https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
        const instanceMemoryInMb = randomMemorySize({
            min: 128,
            max: 4 * 1024,
            step: 128,
        });

        this.tfg.resource(AzureResourceType.LambdaFunction, name, {
            ...runtime,
            name,
            instance_memory_in_mb: instanceMemoryInMb,
            labels: { name, environment, service },
        });

        return this;
    }
}

export { AzureGenerator };
