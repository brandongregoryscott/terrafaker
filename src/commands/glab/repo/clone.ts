import { VcsProviderNames } from "../../../enums/vcs-providers.js";
import { BaseCommand } from "../../../utilities/base-command.js";
import {
    directoryFlag,
    requiredPrefixFlag,
    toCamelCaseFlags,
} from "../../../utilities/flags.js";
import { Gitlab } from "../../../utilities/gitlab.js";

class Clone extends BaseCommand {
    static description = `Clones repos from your ${VcsProviderNames.Gitlab} account, useful for pulling down generated repos for manual modifications.`;

    static flags = {
        directory: directoryFlag,

        prefix: requiredPrefixFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(Clone);
        const { directory, prefix } = toCamelCaseFlags(flags);

        await this.cloneRepos({
            cloneRepo: Gitlab.cloneRepo,
            directory,
            listRepos: Gitlab.listRepos,
            prefix,
        });
    }
}

export { Clone };
