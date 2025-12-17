import { expect, it, describe, vi } from "vitest";
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

        public randomRegion(): string {
            return "us-east-1";
        }
    }

    describe("constructor", () => {
        it("calls addProvider", () => {
            const addProvider = vi.fn();
            class TestGenerator extends ProviderGenerator {
                public addProvider() {
                    addProvider();
                }

                public addComputeInstance(): this {
                    throw new Error("Method not implemented.");
                }

                public addLambdaFunction(): this {
                    throw new Error("Method not implemented.");
                }

                public randomRegion(): string {
                    return "us-east-1";
                }
            }

            new TestGenerator();

            expect(addProvider).toHaveBeenCalledTimes(1);
        });
    });

    describe("toString", () => {
        it("returns stringified file", () => {
            const generator = new TestGenerator().addComputeInstance();

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
