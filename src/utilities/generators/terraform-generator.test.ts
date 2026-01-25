import { expect, it, describe, vi } from "vitest";
import { TerraformGenerator } from "./terraform-generator.js";

describe("TerraformGenerator", () => {
    class TestGenerator extends TerraformGenerator {
        #computeInstanceCount = 0;
        #lambdaFunctionCount = 0;

        addComputeInstance(): this {
            this.tfg.resource(
                "compute-instance",
                `instance-${++this.#computeInstanceCount}`,
                {
                    machine: "machine-xl",
                }
            );

            return this;
        }

        addLambdaFunction(): this {
            this.tfg.resource(
                "lambda-function",
                `function-${++this.#lambdaFunctionCount}`,
                {}
            );

            return this;
        }

        addProvider(): void {
            this.tfg.provider("test", {
                region: "us-east",
            });
        }

        randomRegion(): string {
            return "us-east-1";
        }
    }

    describe("constructor", () => {
        it("calls addProvider", () => {
            const addProvider = vi.fn();
            class TestGenerator extends TerraformGenerator {
                addComputeInstance(): this {
                    throw new Error("Method not implemented.");
                }

                addLambdaFunction(): this {
                    throw new Error("Method not implemented.");
                }

                addProvider() {
                    addProvider();
                }

                randomRegion(): string {
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
