import { Flags } from "@oclif/core";
import { generateAwsFile } from "../../utilities/generators/aws-generators.js";
import path from "node:path";
import { randomMemorableSlug } from "../../utilities/generators/generator-utils.js";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { BaseCommand } from "../../utilities/base-command.js";

class Repo extends BaseCommand {
    static flags = {
        directory: Flags.string({
            description: "Directory to generate the repo(s) in",
            default: ".",
        }),

        count: Flags.integer({
            description: "Number of repos to generate",
            default: 1,
        }),

        "file-count": Flags.integer({
            description: "Number of files per repo to generate",
            default: 3,
        }),

        "resource-count": Flags.integer({
            description: "Number of resources per file to generate",
            default: 3,
        }),

        prefix: Flags.string({
            description:
                "Prefix for repo names, useful for quickly identifying generated content",
            default: "tf_",
        }),

        format: Flags.boolean({
            char: "f",
            description:
                "Format the output terraform files. Requires `terraform` to be in your $PATH.",
            default: true,
            allowNo: true,
        }),

        "create-remote": Flags.boolean({
            description:
                "Create and push a remote GitHub repo. Requires the `gh` CLI to be installed and authenticated.",
        }),

        public: Flags.boolean({
            description: "Whether the remote repo(s) created are public.",
            default: false,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Repo);
        const {
            format,
            prefix,
            count,
            public: isPublic,
            "resource-count": resourceCount,
            "file-count": fileCount,
            "create-remote": createRemote,
        } = flags;

        const directory = path.resolve(process.cwd(), flags.directory);

        for (let i = 0; i < count; i++) {
            const repoName = `${prefix}${randomMemorableSlug()}`;
            const repoPath = path.join(directory, repoName);
            fs.mkdirSync(repoPath);
            execSync(`cd ${repoPath} && git init`);
            this.log(`✅ Successfully generated repo ${repoPath}`);

            for (let j = 0; j < fileCount; j++) {
                const tfFilename = `${randomMemorableSlug()}.tf`;
                const tfg = generateAwsFile({ resourceCount });

                tfg.write({ format, dir: repoPath, tfFilename });

                this.log(`✅ Successfully generated ${tfFilename}`);
            }

            execSync(
                `cd ${repoPath} && git add . && git commit -m "initial commit"`
            );

            if (createRemote) {
                const remoteRepoUrl = execSync(
                    `gh repo create ${repoName} --source ${repoName} ${isPublic ? "--public" : "--private"} --push`
                );
                this.log(`✅ Successfully pushed to ${remoteRepoUrl}`);
            }
        }
    }
}

export { Repo };
