import { Flags } from "@oclif/core";
import path from "node:path";
import type { Provider } from "../../enums/providers.js";
import { HelpMessages } from "../../enums/help-messages.js";
import { VcsProviders } from "../../enums/vcs-providers.js";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    chaosTagsFlag,
    directoryFlag,
    formatFlag,
    getTagsOption,
    noTagsFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
    vcsProviderFlag,
} from "../../utilities/flags.js";
import { RepoGenerator } from "../../utilities/generators/repo-generator.js";
import { GitHub } from "../../utilities/github.js";
import { GitLab } from "../../utilities/gitlab.js";
import { success } from "../../utilities/string-utils.js";

class Repo extends BaseCommand {
    static description = "Generates repo(s) with multiple terraform files.";

    static flags = {
        "chaos-tags": chaosTagsFlag,
        count: Flags.integer({
            default: 1,
            description: "Number of repos to generate",
        }),
        "create-remote": Flags.boolean({
            description: `Create and push a remote repo. ${HelpMessages.RequiresVcsCLI}`,
        }),
        directory: directoryFlag,
        "file-count": Flags.integer({
            default: 3,
            description: "Number of files per repo to generate",
        }),
        format: formatFlag,
        "no-tags": noTagsFlag,
        prefix: Flags.string({
            default: "tf_",
            description:
                "Prefix for repo names, useful for quickly identifying generated content",
        }),
        provider: providerFlag,
        public: Flags.boolean({
            default: false,
            description: "Whether the remote repo(s) created are public.",
        }),
        quiet: quietFlag,
        "resource-count": resourceCountFlag,
        tags: tagsFlag(),
        "vcs-provider": vcsProviderFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Repo);
        const {
            count,
            "create-remote": createRemote,
            "file-count": fileCount,
            format,
            prefix,
            public: isPublic,
            quiet,
            "resource-count": resourceCount,
            "vcs-provider": vcsProvider,
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
                quiet,
                resourceCount,
                tags,
            });

            if (createRemote) {
                switch (vcsProvider) {
                    case VcsProviders.GitHub:
                        await GitHub.pushRepo({ isPublic, path });
                        break;
                    case VcsProviders.GitLab:
                        await GitLab.pushRepo({ isPublic, path });
                        break;
                }

                if (!quiet) {
                    this.log(success(`Successfully pushed '${name}'`));
                }
            }
        }
    }
}

export { Repo };
