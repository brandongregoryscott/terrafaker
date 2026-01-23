import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { Azure } from "../../../utilities/azure.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import { directoryFlag, requiredPrefixFlag } from "../../../utilities/flags.js";

class Clone extends BaseCommand {
    static description = `Clones repos from your ${VcsProviderNames.Azure} account, useful for pulling down generated repos for manual modifications.`;

    static flags = {
        directory: directoryFlag,

        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Clone);
        const { directory, prefix } = flags;

        await this.cloneRepos({
            cloneRepo: Azure.cloneRepo,
            directory,
            listRepos: Azure.listRepos,
            prefix,
        });
    }
}

export { Clone };
