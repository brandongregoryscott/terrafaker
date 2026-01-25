import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
    AZURE_REGIONS,
} from "../../constants/azure.js";
import { Random } from "../random.js";
import { TerraformGenerator } from "./terraform-generator.js";

const AzureResourceType = {
    ComputeInstance: "azurerm_linux_virtual_machine",
    LambdaFunction: "azurerm_linux_function_app",
} as const;

class AzureTerraformGenerator extends TerraformGenerator {
    addComputeInstance(): this {
        const name = Random.snakeSlug();
        const instanceType = Random.item(AZURE_INSTANCE_TYPES);

        this.tfg.resource(AzureResourceType.ComputeInstance, name, {
            size: instanceType,
            ...this.getTagsBlock(),
        });

        return this;
    }

    addLambdaFunction(): this {
        const name = Random.snakeSlug();
        const runtime = Random.item(AZURE_LAMBDA_RUNTIMES);
        // There's a lot of different configurations listed, so just guessing here.
        // https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
        const instanceMemoryInMb = Random.memorySize({
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

    addProvider(): void {
        this.tfg.provider("azurerm", { region: this.region });
    }

    randomRegion(): string {
        return Random.item(AZURE_REGIONS);
    }
}

export { AzureTerraformGenerator };
