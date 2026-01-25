import type { ProviderGeneratorOptions } from "./provider-generator.js";
import {
    GCP_GPU_MACHINE_TYPES,
    GCP_INSTANCE_TYPES,
    GCP_LAMBDA_RUNTIMES,
    GCP_REGIONS,
} from "../../constants/gcp.js";
import { Random } from "../random.js";
import { TerraformGenerator } from "./terraform-generator.js";

const GcpResourceType = {
    ComputeInstance: "google_compute_instance",
    LambdaFunction: "google_cloudfunctions_function",
} as const;

class GcpTerraformGenerator extends TerraformGenerator {
    constructor(options?: ProviderGeneratorOptions) {
        super(options);
        this.tagKey = "labels";
    }

    addComputeInstance(): this {
        const name = Random.snakeSlug();
        const machineType = Random.item(GCP_INSTANCE_TYPES);
        const guestAccelerator = Random.chance(0.5)
            ? {
                  guest_accelerator: {
                      count: Random.integer({ max: 4, min: 1 }),
                      type: Random.item(GCP_GPU_MACHINE_TYPES),
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

    addLambdaFunction(): this {
        const name = Random.snakeSlug();
        const runtime = Random.item(GCP_LAMBDA_RUNTIMES);
        // @see https://docs.cloud.google.com/run/docs/configuring/services/memory-limits
        const availableMemoryMb = Random.memorySize({
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

    addProvider(): void {
        this.tfg.provider("google", { region: this.region });
    }

    randomRegion(): string {
        return Random.item(GCP_REGIONS);
    }
}

export { GcpTerraformGenerator };
