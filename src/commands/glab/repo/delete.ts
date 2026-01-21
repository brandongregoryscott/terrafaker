import { HelpMessages } from "../../../enums/help-messages.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { requiredPrefixFlag } from "../../../utilities/flags.js";
import { GitLab } from "../../../utilities/gitlab.js";

class Delete extends BaseCommand {
    static description = `Deletes repos from your GitLab account, useful for cleaning up generated test data. ${HelpMessages.RequiresGlabCli}`;

    static flags = {
        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Delete);
        const { prefix } = flags;

        await this.deleteRepos({
            deleteRepo: GitLab.deleteRepo,
            listRepos: GitLab.listRepos,
            prefix,
        });
    }
}

export { Delete };
