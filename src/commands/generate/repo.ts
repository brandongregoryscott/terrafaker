import { Flags } from "@oclif/core";
import path from "node:path";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    chaosTagsFlag,
    formatFlag,
    getTagsOption,
    noTagsFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
} from "../../utilities/flags.js";
import { $ } from "zx";
import { HelpMessages } from "../../enums/help-messages.js";
import type { Provider } from "../../enums/providers.js";
import { RepoGenerator } from "../../utilities/generators/repo-generator.js";
import { success } from "../../utilities/string-utils.js";

class Repo extends BaseCommand {
    static description = "Generates repo(s) with multiple terraform files.";

    static flags = {
        "chaos-tags": chaosTagsFlag,
        count: Flags.integer({
            description: "Number of repos to generate",
            default: 1,
        }),
        "create-remote": Flags.boolean({
            description: `Create and push a remote GitHub repo. ${HelpMessages.RequiresGhCli}`,
        }),
        directory: Flags.string({
            description: "Directory to generate the repo(s) in",
            default: ".",
        }),
        "file-count": Flags.integer({
            description: "Number of files per repo to generate",
            default: 3,
        }),
        format: formatFlag,
        "no-tags": noTagsFlag,
        prefix: Flags.string({
            description:
                "Prefix for repo names, useful for quickly identifying generated content",
            default: "tf_",
        }),
        provider: providerFlag,
        public: Flags.boolean({
            description: "Whether the remote repo(s) created are public.",
            default: false,
        }),
        quiet: quietFlag,
        "resource-count": resourceCountFlag,
        tags: tagsFlag(),
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
        const tags = getTagsOption(flags);
        const provider = flags.provider as Provider | undefined;

        const directory = path.resolve(process.cwd(), flags.directory);

        for (let i = 0; i < count; i++) {
            const { name, path } = await RepoGenerator.generate({
                directory,
                fileCount,
                format,
                prefix,
                provider,
                resourceCount,
                quiet,
                tags,
            });

            if (createRemote) {
                await $`gh repo create ${name} --source ${path} ${isPublic ? "--public" : "--private"} --push`;

                if (!quiet) {
                    this.log(success(`Successfully pushed '${name}'`));
                }
            }
        }
    }
}

export { Repo };
