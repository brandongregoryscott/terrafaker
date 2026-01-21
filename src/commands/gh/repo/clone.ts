import { HelpMessages } from "../../../enums/help-messages.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { directoryFlag, requiredPrefixFlag } from "../../../utilities/flags.js";
import { GitHub } from "../../../utilities/github.js";

class Clone extends BaseCommand {
    static description = `Clones repos from your GitHub account, useful for pulling down generated repos for manual modifications. ${HelpMessages.RequiresGhCli}`;

    static flags = {
        directory: directoryFlag,

        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Clone);
        const { directory, prefix } = flags;

        await this.cloneRepos({
            cloneRepo: GitHub.cloneRepo,
            directory,
            listRepos: GitHub.listRepos,
            prefix,
        });
    }
}

export { Clone };
