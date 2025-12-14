import { Flags } from "@oclif/core";
import path from "node:path";
import {
    generateRepo,
    randomProvider,
} from "../../utilities/generators/generator-utils.js";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    formatFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
} from "../../utilities/flags.js";
import { $ } from "zx";
import { HelpMessages } from "../../enums/help-messages.js";
import type { Provider } from "../../enums/providers.js";

class Repo extends BaseCommand {
    static description = "Generates repo(s) with multiple terraform files.";

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

        "resource-count": resourceCountFlag,

        prefix: Flags.string({
            description:
                "Prefix for repo names, useful for quickly identifying generated content",
            default: "tf_",
        }),

        provider: providerFlag,

        format: formatFlag,

        "create-remote": Flags.boolean({
            description: `Create and push a remote GitHub repo. ${HelpMessages.RequiresGhCli}`,
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
        const provider = flags.provider as Provider | undefined;

        const directory = path.resolve(process.cwd(), flags.directory);

        for (let i = 0; i < count; i++) {
            const { name, path } = await generateRepo({
                directory,
                fileCount,
                format,
                prefix,
                provider: provider ?? randomProvider(),
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
