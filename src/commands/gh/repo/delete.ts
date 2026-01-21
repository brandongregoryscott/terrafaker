import { HelpMessages } from "../../../enums/help-messages.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { requiredPrefixFlag } from "../../../utilities/flags.js";
import { GitHub } from "../../../utilities/github.js";

class Delete extends BaseCommand {
    static description = `Deletes repos from your GitHub account, useful for cleaning up generated test data. ${HelpMessages.RequiresGhCli}

If the deletion fails, you may need to refresh your CLI permissions with \`gh auth refresh -s delete_repo\``;

    static flags = {
        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Delete);
        const { prefix } = flags;

        await this.deleteRepos({
            deleteRepo: GitHub.deleteRepo,
            listRepos: GitHub.listRepos,
            prefix,
        });
    }
}

export { Delete };
