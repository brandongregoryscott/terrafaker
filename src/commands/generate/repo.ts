import { Flags } from "@oclif/core";
import path from "node:path";
import type { Provider } from "../../enums/providers.js";
import { HelpMessages } from "../../enums/help-messages.js";
import { VcsProviders } from "../../enums/vcs-providers.js";
import { Azure } from "../../utilities/azure.js";
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
import { Github } from "../../utilities/github.js";
import { Gitlab } from "../../utilities/gitlab.js";
import { StringUtils } from "../../utilities/string-utils.js";

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
                    case VcsProviders.Azure:
                        await Azure.pushRepo({ path });
                        break;
                    case VcsProviders.Github:
                        await Github.pushRepo({ isPublic, path });
                        break;
                    case VcsProviders.Gitlab:
                        await Gitlab.pushRepo({ isPublic, path });
                        break;
                }

                if (!quiet) {
                    this.log(
                        StringUtils.success(`Successfully pushed '${name}'`)
                    );
                }
            }
        }
    }
}

export { Repo };
