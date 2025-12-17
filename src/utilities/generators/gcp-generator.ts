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
    public addProvider(): void {
        this.tfg.provider("google", { region: this.region });
    }

    public addComputeInstance(): this {
        const name = randomMemorableSlug();
        const machineType = randomItem(GCP_INSTANCE_TYPES);
        const guestAccelerator = maybe(0.5)
            ? {
                  guest_accelerator: {
                      type: randomItem(GCP_GPU_MACHINE_TYPES),
                      count: randomInt({ min: 1, max: 4 }),
                  },
              }
            : {};

        this.tfg.resource(GcpResourceType.ComputeInstance, name, {
            zone: this.region,
            machine_type: machineType,
            ...guestAccelerator,
            labels: this.getTags(),
        });

        return this;
    }

    public addLambdaFunction(): this {
        const name = randomMemorableSlug();
        const runtime = randomItem(GCP_LAMBDA_RUNTIMES);
        // @see https://docs.cloud.google.com/run/docs/configuring/services/memory-limits
        const availableMemoryMb = randomMemorySize({
            min: 128,
            max: 32 * 1024,
            step: 128,
        });

        this.tfg.resource(GcpResourceType.LambdaFunction, name, {
            runtime,
            name,
            available_memory_mb: availableMemoryMb,
            labels: this.getTags(),
        });

        return this;
    }

    public randomRegion(): string {
        return randomItem(GCP_REGIONS);
    }
}

export { GcpGenerator };
