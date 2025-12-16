import { describe, expect, it } from "vitest";
import { getTerraformPropertyValue } from "../../test/test-utils.js";
import { GcpGenerator } from "./gcp-generator.js";
import {
    GCP_INSTANCE_TYPES,
    GCP_LAMBDA_RUNTIMES,
} from "../../constants/gcp.js";

describe("GcpGenerator", () => {
    describe("addComputeInstance", () => {
        const getInstanceType = (terraform: string) =>
            getTerraformPropertyValue(terraform, "machine_type");

        it("returns a gcp instance type", () => {
            const terraform = new GcpGenerator()
                .addComputeInstance()
                .toString();
            const machineType = getInstanceType(terraform);

            expect(GCP_INSTANCE_TYPES).toContain(machineType);
        });
    });

    describe("addLambdaFunction", () => {
        const getLambdaRuntime = (terraform: string) =>
            getTerraformPropertyValue(terraform, "runtime");

        it("returns a gcp lambda runtime", () => {
            const terraform = new GcpGenerator().addLambdaFunction().toString();
            const runtime = getLambdaRuntime(terraform);

            expect(GCP_LAMBDA_RUNTIMES).toContainEqual(runtime);
        });
    });
});
