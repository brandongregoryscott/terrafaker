import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
    AZURE_REGIONS,
} from "../../constants/azure.js";
import {
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
} from "./generator-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

const AzureResourceType = {
    ComputeInstance: "azurerm_linux_virtual_machine",
    LambdaFunction: "azurerm_linux_function_app",
} as const;

class AzureGenerator extends ProviderGenerator {
    public addComputeInstance(): this {
        const name = randomMemorableSlug();
        const instanceType = randomItem(AZURE_INSTANCE_TYPES);

        this.tfg.resource(AzureResourceType.ComputeInstance, name, {
            size: instanceType,
            ...this.getTagsBlock(),
        });

        return this;
    }

    public addLambdaFunction(): this {
        const name = randomMemorableSlug();
        const runtime = randomItem(AZURE_LAMBDA_RUNTIMES);
        // There's a lot of different configurations listed, so just guessing here.
        // https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
        const instanceMemoryInMb = randomMemorySize({
            max: 4 * 1024,
            min: 128,
            step: 128,
        });

        this.tfg.resource(AzureResourceType.LambdaFunction, name, {
            ...runtime,
            instance_memory_in_mb: instanceMemoryInMb,
            name,
            ...this.getTagsBlock(),
        });

        return this;
    }

    public addProvider(): void {
        this.tfg.provider("azurerm", { region: this.region });
    }

    public randomRegion(): string {
        return randomItem(AZURE_REGIONS);
    }
}

export { AzureGenerator };
