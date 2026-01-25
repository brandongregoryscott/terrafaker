import type { Template } from "cloudform";
import { describe, expect, it } from "vitest";
import {
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
    AWS_REGIONS,
} from "../../constants/aws.js";
import { CloudformationGenerator } from "./cloudformation-generator.js";

const findFirstResource = (json: string) => {
    const template: Template = JSON.parse(json);
    const resourceName = Object.keys(template.Resources ?? {})[0];
    return {
        name: resourceName,
        ...template.Resources?.[resourceName],
    };
};

describe("CloudformationGenerator", () => {
    describe("constructor", () => {
        it("sets AWSTemplateFormatVersion to 2010-09-09", () => {
            const json = new CloudformationGenerator().toString();
            const template: Template = JSON.parse(json);

            expect(template.AWSTemplateFormatVersion).toBe("2010-09-09");
        });

        it("selects a valid AWS region", () => {
            const generator = new CloudformationGenerator();
            expect(AWS_REGIONS).toContain(generator.region);
        });
    });

    describe("addComputeInstance", () => {
        it("creates an AWS::EC2::Instance resource", () => {
            const json = new CloudformationGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResource(json);
            expect(resource.Type).toBe("AWS::EC2::Instance");
        });

        it("returns a valid aws instance type", () => {
            const json = new CloudformationGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResource(json);
            expect(AWS_INSTANCE_TYPES).toContain(
                resource.Properties?.InstanceType
            );
        });

        it("adds tags when provided", () => {
            const tags = { Environment: "test", Team: "platform" };
            const json = new CloudformationGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResource(json);
            expect(resource.Properties?.Tags).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        Key: "Environment",
                        Value: "test",
                    }),
                    expect.objectContaining({ Key: "Team", Value: "platform" }),
                ])
            );
        });
    });

    describe("addLambdaFunction", () => {
        it("creates an AWS::Lambda::Function resource", () => {
            const json = new CloudformationGenerator()
                .addLambdaFunction()
                .toString();

            const resource = findFirstResource(json);
            expect(resource.Type).toBe("AWS::Lambda::Function");
        });

        it("returns a valid aws lambda runtime", () => {
            const json = new CloudformationGenerator()
                .addLambdaFunction()
                .toString();

            const resource = findFirstResource(json);
            expect(AWS_LAMBDA_RUNTIMES).toContain(resource.Properties?.Runtime);
        });

        it("includes required Code and Role properties", () => {
            const json = new CloudformationGenerator()
                .addLambdaFunction()
                .toString();

            const resource = findFirstResource(json);
            expect(resource.Properties?.Code).toBeDefined();
            expect(resource.Properties?.Code.S3Bucket).toBeDefined();
            expect(resource.Properties?.Code.S3Key).toBeDefined();
            expect(resource.Properties?.Role).toMatch(
                /^arn:aws:iam::[a-f0-9]+:role\//
            );
        });

        it("adds tags when provided", () => {
            const tags = { Service: "api" };
            const json = new CloudformationGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResource(json);

            expect(resource.Properties?.Tags).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ Key: "Service", Value: "api" }),
                ])
            );
        });
    });

    describe("addRandomResource", () => {
        it("adds a resource to the template", () => {
            const json = new CloudformationGenerator()
                .addRandomResource()
                .toString();
            const template: Template = JSON.parse(json);

            expect(Object.keys(template.Resources ?? {}).length).toBe(1);
        });
    });

    describe("toString", () => {
        it("returns valid JSON", () => {
            const json = new CloudformationGenerator()
                .addComputeInstance()
                .toString();

            expect(() => JSON.parse(json)).not.toThrow();
        });

        it("returns formatted JSON with indentation", () => {
            const json = new CloudformationGenerator()
                .addComputeInstance()
                .toString();

            expect(json).toContain("\n");
            expect(json).toContain("  ");
        });
    });
});
