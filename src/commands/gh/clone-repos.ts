import { Flags } from "@oclif/core";
import { execSync } from "node:child_process";
import { confirm } from "@inquirer/prompts";
import { isEmpty } from "lodash-es";
import path from "node:path";
import { listRepos, stringifyRepos } from "../../utilities/github.js";
import { BaseCommand } from "../../utilities/base-command.js";
import { HelpMessages } from "../../enums/help-messages.js";

class CloneRepos extends BaseCommand {
    static description = `Clones repos from your Github account, useful for pulling down generated repos for manual modifications. ${HelpMessages.RequiresGhCli}`;

    static flags = {
        directory: Flags.string({
            description: "Directory to clone the repo(s) in",
            default: ".",
        }),

        prefix: Flags.string({
            description: "Prefix for the repos to clone, such as 'tf_'",
            required: true,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(CloneRepos);
        const { prefix } = flags;

        const allRepos = listRepos();
        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (isEmpty(repos)) {
            this.log(`Repos found:\n${stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        this.log(`Repos to clone:\n${stringifyRepos(repos)}`);

        const confirmation = await confirm({
            message: "Continue with cloning these repos?",
        });

        if (!confirmation) {
            return;
        }

        repos.forEach((repo) => {
            const directory = path.resolve(
                process.cwd(),
                flags.directory,
                repo.name
            );

            execSync(`gh repo clone ${repo.nameWithOwner} ${directory}`, {
                stdio: "inherit",
            });
        });
    }
}

export { CloneRepos };
