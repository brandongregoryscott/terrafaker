import { describe, expect, it } from "vitest";
import { AzureGenerator } from "./azure-generator.js";
import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
} from "../../constants/azure.js";
import { getTerraformPropertyValue } from "../../test/test-utils.js";

describe("AzureGenerator", () => {
    describe("addComputeInstance", () => {
        const getInstanceType = (terraform: string) =>
            getTerraformPropertyValue(terraform, "size");

        it("returns an azure instance type", () => {
            const terraform = new AzureGenerator()
                .addComputeInstance()
                .toString();
            const machineType = getInstanceType(terraform);

            expect(AZURE_INSTANCE_TYPES).toContain(machineType);
        });

        it("adds tags block", () => {
            const terraform = new AzureGenerator({ tags: { foo: "bar" } })
                .addComputeInstance()
                .toString();

            expect(terraform).toContain("tags = {");
        });
    });

    describe("addLambdaFunction", () => {
        const getLambdaRuntime = (terraform: string) => {
            const runtime_name = getTerraformPropertyValue(
                terraform,
                "runtime_name"
            );
            const runtime_version = getTerraformPropertyValue(
                terraform,
                "runtime_version"
            );
            return { runtime_name, runtime_version };
        };

        it("returns an azure lambda runtime", () => {
            const terraform = new AzureGenerator()
                .addLambdaFunction()
                .toString();
            const runtime = getLambdaRuntime(terraform);

            expect(AZURE_LAMBDA_RUNTIMES).toContainEqual(runtime);
        });

        it("adds tags block", () => {
            const terraform = new AzureGenerator({ tags: { foo: "bar" } })
                .addLambdaFunction()
                .toString();

            expect(terraform).toContain("tags = {");
        });
    });
});
