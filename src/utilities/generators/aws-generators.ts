import { TerraformGenerator } from "terraform-generator";
import type {
    FileGeneratorOptions,
    ResourceGeneratorOptions,
} from "./generator-utils.js";
import {
    maybe,
    randomEnvironmentTag,
    randomId,
    randomItem,
    randomMemorableSlug,
    randomMemorySize,
    randomServiceTag,
    unique,
} from "./generator-utils.js";
import {
    AWS_EBS_VOLUME_TYPES,
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
    AWS_REGIONS,
} from "../../constants/aws.js";
import { range } from "lodash-es";
import type { ObjectValues } from "../../types/object-values.js";

const AwsResourceType = {
    Instance: "aws_instance",
    LambdaFunction: "aws_lambda_function",
} as const;

type AwsResourceType = ObjectValues<typeof AwsResourceType>;

const randomRegion = () => randomItem(AWS_REGIONS);

const randomAmi = unique(() => `ami-${randomId()}`);

const randomRole = unique(
    () => `arn:aws:iam::${randomId()}:mfa/${randomMemorableSlug()}`
);

const randomResourceType = () => randomItem(Object.values(AwsResourceType));

const generateAwsInstance = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const ami = randomAmi();
    const instanceType = randomItem(AWS_INSTANCE_TYPES);
    const name = randomMemorableSlug();

    const rootBlockDevice = maybe(0.5)
        ? {
              root_block_device: {
                  volume_size: randomMemorySize({
                      min: 1024,
                      max: 64 * 1024 * 1024,
                      step: 1024,
                  }),
                  volume_type: randomItem(AWS_EBS_VOLUME_TYPES),
              },
          }
        : {};

    tfg.resource(AwsResourceType.Instance, name, {
        ami,
        instance_type: instanceType,
        ...rootBlockDevice,
        tags: { name, environment, service },
    });
};

const generateAwsLambdaFunction = (options: ResourceGeneratorOptions) => {
    const {
        tfg,
        environment = randomEnvironmentTag(),
        service = randomServiceTag(),
    } = options;

    const ami = randomAmi();
    const name = randomMemorableSlug();

    const runtime = randomItem(AWS_LAMBDA_RUNTIMES);
    const functionName = randomItem(["run", "test", "handler"]);
    const handler = `${randomItem(["exports", "index"])}.${functionName}`;
    /** @see https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html */
    const memorySize = randomMemorySize({ min: 128, max: 10240, step: 128 });
    const role = randomRole();

    tfg.resource(AwsResourceType.LambdaFunction, name, {
        ami,
        runtime,
        handler,
        function_name: functionName,
        memory_size: memorySize,
        role,
        tags: { name, environment, service },
    });
};

interface GenerateAwsResourceByTypeOptions extends ResourceGeneratorOptions {
    type: AwsResourceType;
}

const generateResourceByType = (options: GenerateAwsResourceByTypeOptions) => {
    const { type, ...rest } = options;
    switch (type) {
        case AwsResourceType.LambdaFunction:
            return generateAwsLambdaFunction(rest);
        default:
        case AwsResourceType.Instance: {
            return generateAwsInstance(rest);
        }
    }
};

const generateAwsFile = (
    options?: FileGeneratorOptions
): TerraformGenerator => {
    const { resourceCount = 3, environment = randomEnvironmentTag() } =
        options ?? {};
    const tfg = new TerraformGenerator();

    const region = randomRegion();
    tfg.provider("aws", {
        region,
    });

    for (let i = 0; i < resourceCount; i++) {
        const type = randomResourceType();
        generateResourceByType({ type, tfg, environment });
    }

    return tfg;
};

export { generateAwsFile };
