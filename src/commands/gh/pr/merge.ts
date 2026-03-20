import { Flags } from "@oclif/core";
import { $ } from "zx";
import { FlagNames } from "../../../enums/flag-names.js";
import { HelpMessages } from "../../../enums/help-messages.js";
import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import {
    branchPrefixFlag,
    directoryFlag,
    requiredPrefixFlag,
    toCamelCaseFlags,
} from "../../../utilities/flags.js";
import { Github } from "../../../utilities/github.js";
import { ensureRepoClone } from "../../../utilities/pr-utils.js";
import { RepoUtils } from "../../../utilities/repo-utils.js";
import { StringUtils } from "../../../utilities/string-utils.js";

class Merge extends BaseCommand {
    static description = `Merges pull request(s) in ${VcsProviderNames.Github} repos. ${HelpMessages.RequiresGhCli}`;

    static flags = {
        [FlagNames.All]: Flags.boolean({
            description: "Merge all matching pull requests",
        }),
        [FlagNames.BranchPrefix]: branchPrefixFlag,
        [FlagNames.Directory]: directoryFlag,
        [FlagNames.Prefix]: requiredPrefixFlag,
        [FlagNames.PrNumber]: Flags.integer({
            description:
                "Pull request number(s) to merge (otherwise merges the most recent matching PR)",
            multiple: true,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Merge);
        const { all, branchPrefix, directory, prefix, prNumber } =
            toCamelCaseFlags(flags);

        const allRepos = await Github.listRepos();
        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (repos.length === 0) {
            this.log(`Repos found:\n${RepoUtils.stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        for (const repo of repos) {
            await ensureRepoClone(repo, directory);

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
                await $`gh pr merge ${pr.number} --repo ${repo.fullName} --merge --delete-branch`;
                this.log(
                    StringUtils.success(
                        `Merged PR #${pr.number} in '${repo.fullName}'`
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

export { Merge };
