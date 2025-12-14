import { TerraformGenerator } from "terraform-generator";
import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
    AZURE_REGIONS,
} from "../../constants/azure.js";
import type { ObjectValues } from "../../types/object-values.js";
import type {
    FileGeneratorOptions,
    ResourceGeneratorOptions,
} from "./generator-utils.js";
import {
    randomEnvironmentTag,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
    randomServiceTag,
} from "./generator-utils.js";

const AzureResourceType = {
    Instance: "azurerm_linux_virtual_machine",
    LambdaFunction: "azurerm_linux_function_app",
} as const;

type AzureResourceType = ObjectValues<typeof AzureResourceType>;

const randomRegion = () => randomItem(AZURE_REGIONS);

const randomResourceType = () => randomItem(Object.values(AzureResourceType));

const generateAzureInstance = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const machineType = randomItem(AZURE_INSTANCE_TYPES);
    const name = randomMemorableSlug();

    tfg.resource(AzureResourceType.Instance, name, {
        size: machineType,
        tags: { name, environment, service },
    });
};

const generateAzureLambdaFunction = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const runtime = randomItem(AZURE_LAMBDA_RUNTIMES);
    const name = randomMemorableSlug();
    /**
     * There's a lot of different configurations here, so just guessing here.
     * @see https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
     */
    const instanceMemoryInMb = randomMemorySize({
        min: 128,
        max: 4 * 1024,
        step: 128,
    });

    tfg.resource(AzureResourceType.LambdaFunction, name, {
        ...runtime,
        name,
        instance_memory_in_mb: instanceMemoryInMb,
        labels: { name, environment, service },
    });
};

interface GenerateAzureResourceByTypeOptions extends ResourceGeneratorOptions {
    type: AzureResourceType;
}

const generateResourceByType = (
    options: GenerateAzureResourceByTypeOptions
) => {
    const { type, ...rest } = options;
    switch (type) {
        case AzureResourceType.LambdaFunction:
            return generateAzureLambdaFunction(rest);
        default:
        case AzureResourceType.Instance: {
            return generateAzureInstance(rest);
        }
    }
};

const generateAzureFile = (
    options?: FileGeneratorOptions
): TerraformGenerator => {
    const { resourceCount = 3, environment = randomEnvironmentTag() } =
        options ?? {};
    const tfg = new TerraformGenerator();

    const region = randomRegion();
    tfg.provider("azurerm", {
        region,
    });

    for (let i = 0; i < resourceCount; i++) {
        const type = randomResourceType();
        generateResourceByType({ type, tfg, environment });
    }

    return tfg;
};

export { generateAzureFile };
