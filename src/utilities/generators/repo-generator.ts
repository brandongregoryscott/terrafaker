import path from "node:path";
import type { Provider } from "../../enums/providers.js";
import { FileGenerator } from "./file-generator.js";
import { randomMemorableSlug, randomProvider } from "./generator-utils.js";
import { $ } from "zx";
import { mkdir } from "node:fs/promises";
import { success } from "../string-utils.js";

interface GenerateOptions {
    /**
     * Provider to generate a terraform file for. If not provided, random providers will be used.
     */
    provider?: Provider;

    /**
     * Whether the terraform files should be formatted. Requires `terraform` to be installed.
     */
    format?: boolean;

    /**
     * Prefix for the repo
     */
    prefix?: string;

    /**
     * Directory to generate the repo in
     */
    directory?: string;

    /**
     * Number of files to generate
     */
    fileCount?: number;

    /**
     * Number of resources per file to generate
     */
    resourceCount?: number;

    /**
     * Whether output from the commands should be silenced
     */
    quiet?: boolean;
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
            provider,
            prefix = "tf_",
            format,
            fileCount = 3,
            resourceCount,
            quiet,
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
                provider,
                resourceCount,
                format,
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
