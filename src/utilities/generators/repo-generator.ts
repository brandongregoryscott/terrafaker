import { mkdir } from "node:fs/promises";
import path from "node:path";
import { $ } from "zx";
import type { Provider } from "../../enums/providers.js";
import type { ProviderGeneratorTags } from "./provider-generator.js";
import { success } from "../string-utils.js";
import { FileGenerator } from "./file-generator.js";
import { randomMemorableSlug } from "./generator-utils.js";

interface GenerateOptions {
    /**
     * Directory to generate the repo in
     */
    directory?: string;

    /**
     * Number of files to generate
     */
    fileCount?: number;

    /**
     * Whether the terraform files should be formatted. Requires `terraform` to be installed.
     */
    format?: boolean;

    /**
     * Prefix for the repo
     */
    prefix?: string;

    /**
     * Provider to generate a terraform file for. If not provided, random providers will be used.
     */
    provider?: Provider;

    /**
     * Whether output from the commands should be silenced
     */
    quiet?: boolean;

    /**
     * Number of resources per file to generate
     */
    resourceCount?: number;

    /**
     * Tag configuration to be generated with each generated resource
     */
    tags?: ProviderGeneratorTags;
}

interface GenerateResult {
    name: string;
    path: string;
}

class RepoGenerator {
    public static async generate(
        options: GenerateOptions
    ): Promise<GenerateResult> {
        const {
            fileCount = 3,
            format,
            prefix = "tf_",
            provider,
            quiet,
            resourceCount,
            tags,
        } = options;

        const directory = path.resolve(process.cwd(), options.directory ?? ".");

        const repoName = `${prefix}${randomMemorableSlug()}`;
        const repoPath = path.join(directory, repoName);
        const sh = $({ cwd: repoPath, stdio: quiet ? "ignore" : "inherit" });

        await mkdir(repoPath);

        await sh`git init`;

        for (let i = 0; i < fileCount; i++) {
            FileGenerator.generate({
                directory: repoPath,
                format,
                provider,
                resourceCount,
                tags,
            });
        }

        await sh`git add . && git commit -m "initial commit"`;

        if (!quiet) {
            console.log(success(`Successfully generated '${repoPath}'`));
        }

        return { name: repoName, path: repoPath };
    }
}

export { RepoGenerator };
