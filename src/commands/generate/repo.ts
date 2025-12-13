import { Flags } from "@oclif/core";
import path from "node:path";
import { generateRepo } from "../../utilities/generators/generator-utils.js";
import { BaseCommand } from "../../utilities/base-command.js";
import { formatFlag, quietFlag } from "../../utilities/flags.js";
import { $ } from "zx";
import { HELP_MESSAGES } from "../../constants/help-messages.js";

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
            description: `Create and push a remote GitHub repo. ${HELP_MESSAGES.RequiresGhCli}`,
        }),

        public: Flags.boolean({
            description: "Whether the remote repo(s) created are public.",
            default: false,
        }),

        quiet: quietFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Repo);
        const {
            format,
            prefix,
            count,
            public: isPublic,
            quiet,
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
                quiet,
            });

            if (createRemote) {
                await $`gh repo create ${name} --source ${path} ${isPublic ? "--public" : "--private"} --push`;
            }
        }
    }
}

export { Repo };
