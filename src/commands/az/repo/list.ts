import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { Azure } from "../../../utilities/azure.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { RepoUtils } from "../../../utilities/repo-utils.js";

class List extends BaseCommand {
    static description = `Lists repos from your ${VcsProviderNames.Azure} account, useful for debugging.`;

    async run(): Promise<void> {
        await this.parse(List);

        const repos = await Azure.listRepos();
        this.log(RepoUtils.stringifyRepos(repos));
    }
}

export { List };
