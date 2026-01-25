import {
    AWS_EBS_VOLUME_TYPES,
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
    AWS_REGIONS,
} from "../../constants/aws.js";
import { Random } from "../random.js";
import { TerraformGenerator } from "./terraform-generator.js";

const AwsResourceType = {
    ComputeInstance: "aws_instance",
    LambdaFunction: "aws_lambda_function",
} as const;

class AwsTerraformGenerator extends TerraformGenerator {
    addComputeInstance(): this {
        const name = Random.snakeSlug();
        const ami = Random.awsAmi();
        const instanceType = Random.item(AWS_INSTANCE_TYPES);
        const rootBlockDevice = Random.chance(0.5)
            ? {
                  root_block_device: {
                      volume_size: Random.memorySize({
                          max: 64 * 1024 * 1024,
                          min: 1024,
                          step: 1024,
                      }),
                      volume_type: Random.items(AWS_EBS_VOLUME_TYPES),
                  },
              }
            : {};

        this.tfg.resource(AwsResourceType.ComputeInstance, name, {
            ami,
            instance_type: instanceType,
            ...rootBlockDevice,
            ...this.getTagsBlock(),
        });

        return this;
    }

    addLambdaFunction(): this {
        const name = Random.snakeSlug();
        // https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html
        const memorySize = Random.memorySize({
            max: 10240,
            min: 128,
            step: 128,
        });
        const ami = Random.awsAmi();
        const role = Random.awsRole();
        const runtime = Random.item(AWS_LAMBDA_RUNTIMES);
        const functionName = Random.item(["run", "test", "handler"]);
        const handler = `${Random.item(["exports", "index"])}.${functionName}`;

        this.tfg.resource(AwsResourceType.LambdaFunction, name, {
            ami,
            function_name: functionName,
            handler,
            memory_size: memorySize,
            role,
            runtime,
            ...this.getTagsBlock(),
        });

        return this;
    }

    addProvider(): void {
        this.tfg.provider("aws", { region: this.region });
    }

    randomRegion(): string {
        return Random.item(AWS_REGIONS);
    }
}

export { AwsTerraformGenerator };
