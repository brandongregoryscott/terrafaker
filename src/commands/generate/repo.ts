import { Flags } from "@oclif/core";
import path from "node:path";
import { generateRepo } from "../../utilities/generators/generator-utils.js";
import { BaseCommand } from "../../utilities/base-command.js";
import { formatFlag } from "../../utilities/flags.js";
import { $ } from "zx";

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

        format: formatFlag,

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
            const { name, path } = await generateRepo({
                directory,
                fileCount,
                format,
                prefix,
                provider: "aws",
                resourceCount,
                quiet: true,
            });

            if (createRemote) {
                await $`gh repo create ${name} --source ${path} ${isPublic ? "--public" : "--private"} --push`;
            }
        }
    }
}

export { Repo };
