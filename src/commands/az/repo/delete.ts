import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { Azure } from "../../../utilities/azure.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { requiredPrefixFlag } from "../../../utilities/flags.js";

class Delete extends BaseCommand {
    static description = `Deletes repos from your ${VcsProviderNames.Azure} account, useful for cleaning up generated test data.`;

    static flags = {
        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Delete);
        const { prefix } = flags;

        await this.deleteRepos({
            deleteRepo: Azure.deleteRepo,
            listRepos: Azure.listRepos,
            prefix,
        });
    }
}

export { Delete };
