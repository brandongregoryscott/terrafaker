import { describe, expect, it } from "vitest";
import { AzureGenerator } from "./azure-generator.js";
import {
    AZURE_INSTANCE_TYPES,
    AZURE_LAMBDA_RUNTIMES,
} from "../../constants/azure.js";
import { findFirstResourceOrThrow } from "../../test/test-utils.js";

describe("AzureGenerator", () => {
    describe("addComputeInstance", () => {
        it("returns an azure instance type", () => {
            const terraform = new AzureGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AZURE_INSTANCE_TYPES).toContain(resource.value.size);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AzureGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });

    describe("addLambdaFunction", () => {
        it("returns an azure lambda runtime", () => {
            const terraform = new AzureGenerator()
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
            const terraform = new AzureGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });
});
