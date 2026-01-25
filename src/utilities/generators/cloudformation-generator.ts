import { EC2, Lambda, ResourceTag, type Template } from "cloudform";
import { writeFileSync } from "node:fs";
import type {
    ProviderGeneratorOptions,
    WriteToFileOptions,
} from "./provider-generator.js";
import {
    AWS_EBS_VOLUME_TYPES,
    AWS_INSTANCE_TYPES,
    AWS_LAMBDA_RUNTIMES,
    AWS_REGIONS,
} from "../../constants/aws.js";
import { IacTypes } from "../../enums/iac-types.js";
import { Random } from "../random.js";
import { StringUtils } from "../string-utils.js";
import { ProviderGenerator } from "./provider-generator.js";

class CloudformationGenerator extends ProviderGenerator {
    #template: Template;

    constructor(options?: ProviderGeneratorOptions) {
        super(options);
        this.#template = {
            AWSTemplateFormatVersion: "2010-09-09",
            Description: `Generated CloudFormation template for ${this.region}`,
            Resources: {},
        };
    }

    addComputeInstance(): this {
        const name = StringUtils.snakeToPascal(Random.snakeSlug());
        const ami = Random.awsAmi();
        const instanceType = Random.item(AWS_INSTANCE_TYPES);

        const blockDeviceMappings = Random.chance(0.5)
            ? [
                  new EC2.Instance.BlockDeviceMapping({
                      DeviceName: "/dev/sda1",
                      Ebs: new EC2.Instance.Ebs({
                          DeleteOnTermination: true,
                          VolumeSize: Random.memorySize({
                              max: 64 * 1024,
                              min: 8,
                              step: 8,
                          }),
                          VolumeType: Random.item(AWS_EBS_VOLUME_TYPES),
                      }),
                  }),
              ]
            : undefined;

        this.#template.Resources ??= {};
        this.#template.Resources[name] = new EC2.Instance({
            BlockDeviceMappings: blockDeviceMappings,
            ImageId: ami,
            InstanceType: instanceType,
            Tags: this.#getTagsList(),
        });

        return this;
    }

    addLambdaFunction(): this {
        const name = Random.pascalSlug();
        // https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html
        const memorySize = Random.memorySize({
            max: 10240,
            min: 128,
            step: 128,
        });
        const role = Random.awsRole();
        const runtime = Random.item(AWS_LAMBDA_RUNTIMES);
        const functionName = Random.item(["run", "test", "handler"]);
        const handler = `${Random.item(["exports", "index"])}.${functionName}`;
        const s3Bucket = Random.awsBucket();

        this.#template.Resources ??= {};
        this.#template.Resources[name] = new Lambda.Function({
            Code: new Lambda.Function.Code({
                S3Bucket: s3Bucket,
                S3Key: `${Random.snakeSlug()}.zip`,
            }),
            FunctionName: functionName,
            Handler: handler,
            MemorySize: memorySize,
            Role: role,
            Runtime: runtime,
            Tags: this.#getTagsList(),
        });

        return this;
    }

    randomRegion(): string {
        return Random.item(AWS_REGIONS);
    }

    toString(): string {
        // The default export from cloudform to stringify a template is just a function that calls JSON.stringify,
        // and for some reason, I couldn't get it to import properly.
        return JSON.stringify(this.#template, undefined, 4);
    }

    writeToFile(options?: WriteToFileOptions): void {
        const { directory = ".", format = true } = options ?? {};
        const fileName = StringUtils.formatFileName({
            fileName: options?.fileName ?? Random.snakeSlug(),
            iacType: IacTypes.CloudFormation,
        });
        const filePath = `${directory}/${fileName}`;
        const content = !format
            ? JSON.stringify(JSON.parse(this.toString()))
            : this.toString();

        writeFileSync(filePath, content, "utf-8");
    }

    #getTagsList(): ResourceTag[] | undefined {
        const tags = this.getTags();
        if (tags == null) {
            return undefined;
        }

        return Object.entries(tags).map(
            ([key, value]) => new ResourceTag(key, value)
        );
    }
}

export { CloudformationGenerator };
