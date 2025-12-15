import { expect, it, describe } from "vitest";
import { ProviderGenerator } from "./provider-generator.js";

describe("ProviderGenerator", () => {
    class TestGenerator extends ProviderGenerator {
        private computeInstanceCount = 0;
        private lambdaFunctionCount = 0;

        public addProvider(): void {
            this.tfg.provider("test", {
                region: "us-east",
            });
        }

        public addComputeInstance(): this {
            this.tfg.resource(
                "compute-instance",
                `instance-${++this.computeInstanceCount}`,
                {
                    machine: "machine-xl",
                }
            );

            return this;
        }

        public addLambdaFunction(): this {
            this.tfg.resource(
                "lambda-function",
                `function-${++this.lambdaFunctionCount}`,
                {}
            );

            return this;
        }
    }

    describe("toString", () => {
        it("returns stringified file", () => {
            const generator = new TestGenerator();
            generator.addComputeInstance();

            const result = generator.toString();

            expect(result).toStrictEqual(`provider "test"{
region = "us-east"
}

resource "compute-instance" "instance-1"{
machine = "machine-xl"
}`);
        });
    });
});
