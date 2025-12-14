import { TerraformGenerator } from "terraform-generator";
import {
    GCP_GPU_MACHINE_TYPES,
    GCP_INSTANCE_TYPES,
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
    randomServiceTag,
} from "./generator-utils.js";

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
              type: randomItem(GCP_GPU_MACHINE_TYPES),
              count: randomInt({ min: 1, max: 4 }),
          }
        : {};

    tfg.resource(GcpResourceType.Instance, name, {
        machine_type: machineType,
        ...guestAccelerator,
        labels: { name, environment, service },
    });
};

interface GenerateGcpResourceByTypeOptions extends ResourceGeneratorOptions {
    type: GcpResourceType;
}

const generateResourceByType = (options: GenerateGcpResourceByTypeOptions) => {
    const { type, ...rest } = options;
    switch (type) {
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
