import { TerraformGenerator } from "terraform-generator";
import {
    GCP_GPU_MACHINE_TYPES,
    GCP_INSTANCE_TYPES,
    GCP_LAMBDA_RUNTIMES,
    GCP_REGIONS,
} from "../../constants/gcp.js";
import type { ObjectValues } from "../../types/object-values.js";
import type {
    FileGeneratorOptions,
    ResourceGeneratorOptions,
} from "./generator-utils.js";
import {
    maybe,
    randomEnvironmentTag,
    randomInt,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
    randomServiceTag,
} from "./generator-utils.js";
import { range } from "lodash-es";

const GcpResourceType = {
    Instance: "google_compute_instance",
    LambdaFunction: "google_cloudfunctions_function",
} as const;

type GcpResourceType = ObjectValues<typeof GcpResourceType>;

const randomRegion = () => randomItem(GCP_REGIONS);

const randomResourceType = () => randomItem(Object.values(GcpResourceType));

const generateGcpInstance = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const machineType = randomItem(GCP_INSTANCE_TYPES);
    const name = randomMemorableSlug();
    const guestAccelerator = maybe(0.5)
        ? {
              guest_accelerator: {
                  type: randomItem(GCP_GPU_MACHINE_TYPES),
                  count: randomInt({ min: 1, max: 4 }),
              },
          }
        : {};

    tfg.resource(GcpResourceType.Instance, name, {
        machine_type: machineType,
        ...guestAccelerator,
        labels: { name, environment, service },
    });
};

const generateGcpLambdaFunction = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const runtime = randomItem(GCP_LAMBDA_RUNTIMES);
    const name = randomMemorableSlug();
    /** @see https://docs.cloud.google.com/run/docs/configuring/services/memory-limits */
    const availableMemoryMb = randomMemorySize({
        min: 128,
        max: 32 * 1024,
        step: 128,
    });

    tfg.resource(GcpResourceType.LambdaFunction, name, {
        runtime,
        name,
        available_memory_mb: availableMemoryMb,
        labels: { name, environment, service },
    });
};

interface GenerateGcpResourceByTypeOptions extends ResourceGeneratorOptions {
    type: GcpResourceType;
}

const generateResourceByType = (options: GenerateGcpResourceByTypeOptions) => {
    const { type, ...rest } = options;
    switch (type) {
        case GcpResourceType.LambdaFunction:
            return generateGcpLambdaFunction(rest);
        default:
        case GcpResourceType.Instance: {
            return generateGcpInstance(rest);
        }
    }
};

const generateGcpFile = (
    options?: FileGeneratorOptions
): TerraformGenerator => {
    const { resourceCount = 3, environment = randomEnvironmentTag() } =
        options ?? {};
    const tfg = new TerraformGenerator();

    const region = randomRegion();
    tfg.provider("google", {
        region,
    });

    for (let i = 0; i < resourceCount; i++) {
        const type = randomResourceType();
        generateResourceByType({ type, tfg, environment });
    }

    return tfg;
};

export { generateGcpFile };
