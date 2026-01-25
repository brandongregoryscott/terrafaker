import { describe, expect, it } from "vitest";
import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
} from "../../constants/azure.js";
import { findFirstResourceOrThrow } from "../../test/test-utils.js";
import { AzureTerraformGenerator } from "./azure-terraform-generator.js";

describe("AzureTerraformGenerator", () => {
    describe("addComputeInstance", () => {
        it("returns an azure instance type", () => {
            const terraform = new AzureTerraformGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AZURE_INSTANCE_TYPES).toContain(resource.value.size);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AzureTerraformGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });

    describe("addLambdaFunction", () => {
        it("returns an azure lambda runtime", () => {
            const terraform = new AzureTerraformGenerator()
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AZURE_LAMBDA_RUNTIMES).toContainEqual({
                runtime_name: resource.value.runtime_name,
                runtime_version: resource.value.runtime_version,
            });
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AzureTerraformGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });
});
