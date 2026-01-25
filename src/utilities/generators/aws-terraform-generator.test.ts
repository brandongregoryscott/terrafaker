import { describe, expect, it } from "vitest";
import {
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
} from "../../constants/aws.js";
import { findFirstResourceOrThrow } from "../../test/test-utils.js";
import { AwsTerraformGenerator } from "./aws-terraform-generator.js";

describe("AwsTerraformGenerator", () => {
    describe("addComputeInstance", () => {
        it("returns an aws instance type", () => {
            const terraform = new AwsTerraformGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AWS_INSTANCE_TYPES).toContain(resource.value.instance_type);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AwsTerraformGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });

    describe("addLambdaFunction", () => {
        it("returns an aws lambda runtime", () => {
            const terraform = new AwsTerraformGenerator()
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AWS_LAMBDA_RUNTIMES).toContainEqual(resource.value.runtime);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AwsTerraformGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });
});
