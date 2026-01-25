import { Flags } from "@oclif/core";
import path from "node:path";
import { FlagNames } from "../../enums/flag-names.js";
import { HelpMessages } from "../../enums/help-messages.js";
import { VcsProviders } from "../../enums/vcs-providers.js";
import { Azure } from "../../utilities/azure.js";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    chaosTagsFlag,
    cloudProviderFlag,
    directoryFlag,
    formatFlag,
    getTagsOption,
    iacTypeFlag,
    noTagsFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
    toCamelCaseFlags,
    vcsProviderFlag,
} from "../../utilities/flags.js";
import { RepoGenerator } from "../../utilities/generators/repo-generator.js";
import { Github } from "../../utilities/github.js";
import { Gitlab } from "../../utilities/gitlab.js";
import { StringUtils } from "../../utilities/string-utils.js";

class Repo extends BaseCommand {
    static description =
        "Generates repo(s) with multiple infrastructure-as-code files.";

    static flags = {
        [FlagNames.ChaosTags]: chaosTagsFlag,
        [FlagNames.CloudProvider]: cloudProviderFlag(),
        [FlagNames.Count]: Flags.integer({
            default: 1,
            description: "Number of repos to generate",
        }),
        [FlagNames.CreateRemote]: Flags.boolean({
            description: `Create and push a remote repo. ${HelpMessages.RequiresVcsCLI}`,
        }),
        [FlagNames.Directory]: directoryFlag,
        [FlagNames.FileCount]: Flags.integer({
            default: 3,
            description: "Number of files per repo to generate",
        }),
        [FlagNames.Format]: formatFlag,
        [FlagNames.IacType]: iacTypeFlag(),
        [FlagNames.NoTags]: noTagsFlag,
        [FlagNames.Prefix]: Flags.string({
            description:
                "Prefix for repo names, useful for quickly identifying generated content. Defaults to 'tf_' for Terraform or 'cf_' for CloudFormation.",
        }),
        [FlagNames.Public]: Flags.boolean({
            default: false,
            description: "Whether the remote repo(s) created are public.",
        }),
        [FlagNames.Quiet]: quietFlag,
        [FlagNames.ResourceCount]: resourceCountFlag,
        [FlagNames.Tags]: tagsFlag(),
        [FlagNames.VcsProvider]: vcsProviderFlag(),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Repo);
        const {
            cloudProvider,
            count,
            createRemote,
            fileCount,
            format,
            iacType,
            prefix,
            public: isPublic,
            quiet,
            resourceCount,
            vcsProvider,
        } = toCamelCaseFlags(flags);
        const tags = getTagsOption(flags);

        const directory = path.resolve(process.cwd(), flags.directory);

        for (let i = 0; i < count; i++) {
            const { name, path } = await RepoGenerator.generate({
                cloudProvider,
                directory,
                fileCount,
                format,
                iacType,
                prefix,
                quiet,
                resourceCount,
                tags,
            });

            if (!createRemote) {
                return;
            }

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

            if (quiet) {
                return;
            }

            this.log(StringUtils.success(`Successfully pushed '${name}'`));
        }
    }
}

export { Repo };
