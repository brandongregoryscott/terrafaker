import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { Gitlab } from "../../../utilities/gitlab.js";
import { RepoUtils } from "../../../utilities/repo-utils.js";

class List extends BaseCommand {
    static description = `Lists repos from your ${VcsProviderNames.Gitlab} account, useful for debugging.`;

    async run(): Promise<void> {
        await this.parse(List);

        const repos = await Gitlab.listRepos();
        this.log(RepoUtils.stringifyRepos(repos));
    }
}

export { List };
