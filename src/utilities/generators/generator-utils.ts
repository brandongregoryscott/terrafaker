import { faker } from "@faker-js/faker";
import { snakeSlugify } from "../string-utils.js";
import type { TerraformGenerator } from "terraform-generator";
import { ENVIRONMENT_TAGS, SERVICE_TAGS } from "../../constants/tags.js";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { generateAwsFile } from "./aws-generators.js";
import { $ } from "zx";

const PROVIDERS = ["aws"] as const;

type Provider = (typeof PROVIDERS)[number];

type StringGenerator = () => string;

interface ResourceGeneratorOptions {
    tfg: TerraformGenerator;
    environment?: string;
    service?: string;
}

/**
 * Wraps a generator function to ensure the values it returns are not reused within the program runtime
 */
const unique = (generator: StringGenerator): StringGenerator => {
    const used = new Set();
    return () => {
        let value = generator();
        while (used.has(value)) {
            value = generator();
        }

        used.add(value);
        return value;
    };
};

const randomMemorableSlug = unique(() =>
    snakeSlugify(
        `${faker.word.adjective()}_${faker.color.human()}_${faker.animal.type()}`
    )
);

const randomItem = <T>(values: T[]): T => faker.helpers.arrayElement(values);

const randomId = unique(() => faker.internet.mac({ separator: "" }));

const randomEnvironmentTag = () => randomItem(ENVIRONMENT_TAGS);

const randomServiceTag = () => randomItem(SERVICE_TAGS);

interface GenerateFileByProviderOptions {
    provider: Provider;
    resourceCount?: number;
    environment?: string;
}

const generateFileByProvider = (
    options: GenerateFileByProviderOptions
): TerraformGenerator => {
    const { provider, ...rest } = options;
    switch (provider) {
        default:
        case "aws":
            return generateAwsFile(rest);
    }
};

interface GenerateRepoOptions {
    /**
     * Provider to generate a terraform file for.
     */
    provider: Provider;

    /**
     * Environment to use for tags, etc.
     */
    environment?: string;

    /**
     * Whether the terraform files should be formatted. Requires `terraform` to be installed.
     */
    format: boolean;

    /**
     * Prefix for the repo
     */
    prefix: string;

    /**
     * Directory to generate the repo in
     */
    directory: string;

    /**
     * Number of files to generate
     */
    fileCount: number;

    /**
     * Number of resources per file to generate
     */
    resourceCount: number;

    /**
     * Whether output from the commands should be silenced
     */
    quiet?: boolean;
}

interface GenerateRepoResult {
    name: string;
    path: string;
}

const generateRepo = async (
    options: GenerateRepoOptions
): Promise<GenerateRepoResult> => {
    const {
        provider,
        format,
        prefix,
        fileCount,
        resourceCount,
        quiet = false,
    } = options;
    const directory = path.resolve(process.cwd(), options.directory);

    const repoName = `${prefix}${randomMemorableSlug()}`;
    const repoPath = path.join(directory, repoName);
    const sh = $({ cwd: repoPath, quiet });

    await mkdir(repoPath);

    await sh`git init`;

    for (let i = 0; i < fileCount; i++) {
        const tfFilename = `${randomMemorableSlug()}.tf`;

        const tfg = generateFileByProvider({ provider, resourceCount });

        tfg.write({ format, dir: repoPath, tfFilename });
    }

    await sh`git add . && git commit -m "initial commit"`;

    return { name: repoName, path: repoPath };
};

export type { ResourceGeneratorOptions, StringGenerator };
export {
    generateRepo,
    randomEnvironmentTag,
    randomId,
    randomItem,
    randomMemorableSlug,
    randomServiceTag,
    unique,
};
