import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import {
    requiredPrefixFlag,
    toCamelCaseFlags,
} from "../../../utilities/flags.js";
import { Github } from "../../../utilities/github.js";

class Delete extends BaseCommand {
    static description = `Deletes repos from your ${VcsProviderNames.Github} account, useful for cleaning up generated test data.

If the deletion fails, you may need to refresh your CLI permissions with \`gh auth refresh -s delete_repo\``;

    static flags = {
        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Delete);
        const { prefix } = toCamelCaseFlags(flags);

        await this.deleteRepos({
            deleteRepo: Github.deleteRepo,
            listRepos: Github.listRepos,
            prefix,
        });
    }
}

export { Delete };
