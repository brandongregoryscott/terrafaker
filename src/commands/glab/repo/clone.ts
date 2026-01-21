import { HelpMessages } from "../../../enums/help-messages.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { directoryFlag, requiredPrefixFlag } from "../../../utilities/flags.js";
import { GitLab } from "../../../utilities/gitlab.js";

class Clone extends BaseCommand {
    static description = `Clones repos from your GitLab account, useful for pulling down generated repos for manual modifications. ${HelpMessages.RequiresGlabCli}`;

    static flags = {
        directory: directoryFlag,

        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Clone);
        const { directory, prefix } = flags;

        await this.cloneRepos({
            cloneRepo: GitLab.cloneRepo,
            directory,
            listRepos: GitLab.listRepos,
            prefix,
        });
    }
}

export { Clone };
