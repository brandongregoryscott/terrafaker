import type { ProviderGeneratorOptions } from "./provider-generator.js";
import {
    GCP_GPU_MACHINE_TYPES,
    GCP_INSTANCE_TYPES,
    GCP_LAMBDA_RUNTIMES,
    GCP_REGIONS,
} from "../../constants/gcp.js";
import {
    maybe,
    randomInt,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
} from "./generator-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

const GcpResourceType = {
    ComputeInstance: "google_compute_instance",
    LambdaFunction: "google_cloudfunctions_function",
} as const;

class GcpGenerator extends ProviderGenerator {
    constructor(options?: ProviderGeneratorOptions) {
        super(options);
        this.tagKey = "labels";
    }

    public addComputeInstance(): this {
        const name = randomMemorableSlug();
        const machineType = randomItem(GCP_INSTANCE_TYPES);
        const guestAccelerator = maybe(0.5)
            ? {
                  guest_accelerator: {
                      count: randomInt({ max: 4, min: 1 }),
                      type: randomItem(GCP_GPU_MACHINE_TYPES),
                  },
              }
            : {};

        this.tfg.resource(GcpResourceType.ComputeInstance, name, {
            machine_type: machineType,
            zone: this.region,
            ...guestAccelerator,
            ...this.getTagsBlock(),
        });

        return this;
    }

    public addLambdaFunction(): this {
        const name = randomMemorableSlug();
        const runtime = randomItem(GCP_LAMBDA_RUNTIMES);
        // @see https://docs.cloud.google.com/run/docs/configuring/services/memory-limits
        const availableMemoryMb = randomMemorySize({
            max: 32 * 1024,
            min: 128,
            step: 128,
        });

        this.tfg.resource(GcpResourceType.LambdaFunction, name, {
            available_memory_mb: availableMemoryMb,
            name,
            runtime,
            ...this.getTagsBlock(),
        });

        return this;
    }

    public addProvider(): void {
        this.tfg.provider("google", { region: this.region });
    }

    public randomRegion(): string {
        return randomItem(GCP_REGIONS);
    }
}

export { GcpGenerator };
