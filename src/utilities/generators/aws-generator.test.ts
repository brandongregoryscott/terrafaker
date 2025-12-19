import { describe, expect, it } from "vitest";
import { AwsGenerator } from "./aws-generator.js";
import {
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
} from "../../constants/aws.js";
import { findFirstResourceOrThrow } from "../../test/test-utils.js";

describe("AwsGenerator", () => {
    describe("addComputeInstance", () => {
        it("returns an aws instance type", () => {
            const terraform = new AwsGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AWS_INSTANCE_TYPES).toContain(resource.value.instance_type);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AwsGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });

    describe("addLambdaFunction", () => {
        it("returns an aws lambda runtime", () => {
            const terraform = new AwsGenerator().addLambdaFunction().toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(AWS_LAMBDA_RUNTIMES).toContainEqual(resource.value.runtime);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new AwsGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.tags).toStrictEqual(tags);
        });
    });
});
