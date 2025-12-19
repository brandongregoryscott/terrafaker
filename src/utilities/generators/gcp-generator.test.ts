import { describe, expect, it } from "vitest";
import { GcpGenerator } from "./gcp-generator.js";
import {
    GCP_INSTANCE_TYPES,
    GCP_LAMBDA_RUNTIMES,
} from "../../constants/gcp.js";
import { findFirstResourceOrThrow } from "../../test/test-utils.js";

describe("GcpGenerator", () => {
    describe("addComputeInstance", () => {
        it("returns a gcp instance type", () => {
            const terraform = new GcpGenerator()
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(GCP_INSTANCE_TYPES).toContain(resource.value.machine_type);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new GcpGenerator({ tags })
                .addComputeInstance()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.labels).toStrictEqual(tags);
        });
    });

    describe("addLambdaFunction", () => {
        it("returns a gcp lambda runtime", () => {
            const terraform = new GcpGenerator().addLambdaFunction().toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(GCP_LAMBDA_RUNTIMES).toContainEqual(resource.value.runtime);
        });

        it("adds tags block", () => {
            const tags = { foo: "bar" };
            const terraform = new GcpGenerator({ tags })
                .addLambdaFunction()
                .toString();

            const resource = findFirstResourceOrThrow(terraform);
            expect(resource.value.labels).toStrictEqual(tags);
        });
    });
});
