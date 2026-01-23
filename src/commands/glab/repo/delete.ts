import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { requiredPrefixFlag } from "../../../utilities/flags.js";
import { Gitlab } from "../../../utilities/gitlab.js";

class Delete extends BaseCommand {
    static description = `Deletes repos from your ${VcsProviderNames.Gitlab} account, useful for cleaning up generated test data.`;

    static flags = {
        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Delete);
        const { prefix } = flags;

        await this.deleteRepos({
            deleteRepo: Gitlab.deleteRepo,
            listRepos: Gitlab.listRepos,
            prefix,
        });
    }
}

export { Delete };
