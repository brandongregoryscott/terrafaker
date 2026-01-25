import { mkdir } from "node:fs/promises";
import path from "node:path";
import { $ } from "zx";
import type { FileGeneratorOptions } from "./file-generator.js";
import { IacTypes } from "../../enums/iac-types.js";
import { Random } from "../random.js";
import { StringUtils } from "../string-utils.js";
import { FileGenerator } from "./file-generator.js";

interface RepoGeneratorOptions extends Omit<FileGeneratorOptions, "fileName"> {
    /**
     * Number of files to generate
     */
    fileCount?: number;

    /**
     * Prefix for the repo
     */
    prefix?: string;

    /**
     * Whether output from the commands should be silenced
     */
    quiet?: boolean;
}

interface GenerateRepoResult {
    name: string;
    path: string;
}

class RepoGenerator {
    static async generate(
        options: RepoGeneratorOptions
    ): Promise<GenerateRepoResult> {
        const {
            cloudProvider,
            fileCount = 3,
            format,
            iacType = IacTypes.Terraform,
            quiet,
            resourceCount,
            tags,
        } = options;

        // Use appropriate default prefix based on IAC type
        const defaultPrefix =
            iacType === IacTypes.CloudFormation ? "cf_" : "tf_";
        const prefix = options.prefix ?? defaultPrefix;

        const directory = path.resolve(process.cwd(), options.directory ?? ".");

        const repoName = `${prefix}${Random.snakeSlug()}`;
        const repoPath = path.join(directory, repoName);
        const sh = $({ cwd: repoPath, stdio: quiet ? "ignore" : "inherit" });

        await mkdir(repoPath);

        await sh`git init`;

        for (let i = 0; i < fileCount; i++) {
            FileGenerator.generate({
                cloudProvider,
                directory: repoPath,
                format,
                iacType,
                resourceCount,
                tags,
            });
        }

        await sh`git add . && git commit -m "initial commit"`;

        if (!quiet) {
            console.log(
                StringUtils.success(`Successfully generated '${repoPath}'`)
            );
        }

        return { name: repoName, path: repoPath };
    }
}

export { RepoGenerator };
