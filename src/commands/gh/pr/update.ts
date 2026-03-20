import { Flags } from "@oclif/core";
import path from "node:path";
import { $ } from "zx";
import { FlagNames } from "../../../enums/flag-names.js";
import { HelpMessages } from "../../../enums/help-messages.js";
import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import {
    branchPrefixFlag,
    chaosTagsFlag,
    cloudProviderFlag,
    directoryFlag,
    formatFlag,
    getTagsOption,
    iacTypeFlag,
    noTagsFlag,
    requiredPrefixFlag,
    resourceCountFlag,
    tagsFlag,
    toCamelCaseFlags,
} from "../../../utilities/flags.js";
import { FileGenerator } from "../../../utilities/generators/file-generator.js";
import { Github } from "../../../utilities/github.js";
import { ensureRepoClone, selectIacFile } from "../../../utilities/pr-utils.js";
import { RepoUtils } from "../../../utilities/repo-utils.js";
import { StringUtils } from "../../../utilities/string-utils.js";

class Update extends BaseCommand {
    static description = `Updates pull request(s) in ${VcsProviderNames.Github} repos. ${HelpMessages.RequiresGhCli}`;

    static flags = {
        [FlagNames.All]: Flags.boolean({
            description: "Update all matching pull requests",
        }),
        [FlagNames.BranchPrefix]: branchPrefixFlag,
        [FlagNames.ChaosTags]: chaosTagsFlag,
        [FlagNames.CloudProvider]: cloudProviderFlag(),
        [FlagNames.Directory]: directoryFlag,
        [FlagNames.File]: Flags.string({
            description: "Relative path of file to overwrite in the repo",
        }),
        [FlagNames.Format]: formatFlag,
        [FlagNames.IacType]: iacTypeFlag(),
        [FlagNames.NoTags]: noTagsFlag,
        [FlagNames.Prefix]: requiredPrefixFlag,
        [FlagNames.PrNumber]: Flags.integer({
            description:
                "Pull request number(s) to update (otherwise updates the most recent matching PR)",
            multiple: true,
        }),
        [FlagNames.ResourceCount]: resourceCountFlag,
        [FlagNames.Tags]: tagsFlag(),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Update);
        const {
            all,
            branchPrefix,
            cloudProvider,
            directory,
            file,
            format,
            iacType,
            prefix,
            prNumber,
            resourceCount,
        } = toCamelCaseFlags(flags);
        const tags = getTagsOption(flags);

        const allRepos = await Github.listRepos();
        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (repos.length === 0) {
            this.log(`Repos found:\n${RepoUtils.stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        for (const repo of repos) {
            const repoDirectory = await ensureRepoClone(repo, directory);

            const prs = await Github.listPullRequests({
                repoFullName: repo.fullName,
                state: "open",
            });

            const matchingPrs = prs.filter((pr) =>
                pr.headRefName.startsWith(branchPrefix)
            );

            if (matchingPrs.length === 0) {
                this.log(
                    StringUtils.warn(
                        `No open PRs found for '${repo.fullName}' with prefix '${branchPrefix}'`
                    )
                );
                continue;
            }

            let selectedPrs = matchingPrs;
            if (Array.isArray(prNumber) && prNumber.length > 0) {
                selectedPrs = matchingPrs.filter((pr) =>
                    prNumber.includes(pr.number)
                );
            } else if (!all) {
                selectedPrs = [mostRecentPr(matchingPrs)];
            }

            for (const pr of selectedPrs) {
                await $`cd ${repoDirectory} && git fetch origin ${pr.headRefName}`;
                await $`cd ${repoDirectory} && git checkout -B ${pr.headRefName} origin/${pr.headRefName}`;

                const targetFile = await selectIacFile({
                    filePath: file,
                    iacType,
                    repoDirectory,
                });

                FileGenerator.generate({
                    cloudProvider,
                    directory: targetFile.directory,
                    fileName: targetFile.fileName,
                    format,
                    iacType: targetFile.iacType,
                    resourceCount,
                    tags,
                });

                const relativePath = path.relative(
                    repoDirectory,
                    targetFile.filePath
                );

                await $`cd ${repoDirectory} && git add ${relativePath}`;
                await $`cd ${repoDirectory} && git commit -m ${`terrafaker: update PR #${pr.number}`}`;
                await $`cd ${repoDirectory} && git push`;

                this.log(
                    StringUtils.success(
                        `Updated PR #${pr.number} in '${repo.fullName}'`
                    )
                );
            }
        }
    }
}

function mostRecentPr<T extends { createdAt: string }>(prs: T[]): T {
    return [...prs].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    )[0];
}

export { Update };
