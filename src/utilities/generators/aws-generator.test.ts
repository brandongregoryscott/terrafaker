import { describe, expect, it } from "vitest";
import { AwsGenerator } from "./aws-generator.js";
import {
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
} from "../../constants/aws.js";
import { getTerraformPropertyValue } from "../../test/test-utils.js";

describe("AwsGenerator", () => {
    describe("addComputeInstance", () => {
        const getInstanceType = (terraform: string) =>
            getTerraformPropertyValue(terraform, "instance_type");

        it("returns an aws instance type", () => {
            const terraform = new AwsGenerator()
                .addComputeInstance()
                .toString();
            const instanceType = getInstanceType(terraform);

            expect(AWS_INSTANCE_TYPES).toContain(instanceType);
        });
    });

    describe("addLambdaFunction", () => {
        const getLambdaRuntime = (terraform: string) =>
            getTerraformPropertyValue(terraform, "runtime");

        it("returns an aws lambda runtime", () => {
            const terraform = new AwsGenerator().addLambdaFunction().toString();
            const runtime = getLambdaRuntime(terraform);

            expect(AWS_LAMBDA_RUNTIMES).toContainEqual(runtime);
        });
    });
});
