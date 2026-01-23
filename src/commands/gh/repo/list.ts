import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { Github } from "../../../utilities/github.js";
import { RepoUtils } from "../../../utilities/repo-utils.js";

class List extends BaseCommand {
    static description = `Lists repos from your ${VcsProviderNames.Github} account, useful for debugging.`;

    async run(): Promise<void> {
        await this.parse(List);

        const repos = await Github.listRepos();
        this.log(RepoUtils.stringifyRepos(repos));
    }
}

export { List };
