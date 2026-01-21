import {
    AWS_EBS_VOLUME_TYPES,
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
    AWS_REGIONS,
} from "../../constants/aws.js";
import {
    maybe,
    randomId,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
    unique,
} from "./generator-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

const AwsResourceType = {
    ComputeInstance: "aws_instance",
    LambdaFunction: "aws_lambda_function",
} as const;

class AwsGenerator extends ProviderGenerator {
    private randomAmi = unique(() => `ami-${randomId()}`);

    private randomRole = unique(
        () => `arn:aws:iam::${randomId()}:mfa/${randomMemorableSlug()}`
    );

    public addComputeInstance(): this {
        const name = randomMemorableSlug();
        const ami = this.randomAmi();
        const instanceType = randomItem(AWS_INSTANCE_TYPES);
        const rootBlockDevice = maybe(0.5)
            ? {
                  root_block_device: {
                      volume_size: randomMemorySize({
                          max: 64 * 1024 * 1024,
                          min: 1024,
                          step: 1024,
                      }),
                      volume_type: randomItem(AWS_EBS_VOLUME_TYPES),
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

    public addLambdaFunction(): this {
        const name = randomMemorableSlug();
        // https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html
        const memorySize = randomMemorySize({
            max: 10240,
            min: 128,
            step: 128,
        });
        const ami = this.randomAmi();
        const role = this.randomRole();
        const runtime = randomItem(AWS_LAMBDA_RUNTIMES);
        const functionName = randomItem(["run", "test", "handler"]);
        const handler = `${randomItem(["exports", "index"])}.${functionName}`;

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

    public addProvider(): void {
        this.tfg.provider("aws", { region: this.region });
    }

    public randomRegion(): string {
        return randomItem(AWS_REGIONS);
    }
}

export { AwsGenerator };
