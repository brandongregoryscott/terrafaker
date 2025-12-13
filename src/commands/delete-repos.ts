import { Command, Flags } from "@oclif/core";
import { execSync } from "node:child_process";
import { confirm } from "@inquirer/prompts";
import { isEmpty } from "lodash-es";
import { listRepos, stringifyRepos } from "../utilities/github.js";

class DeleteRepos extends Command {
    static description = `Deletes repos from your Github account, useful for cleaning up generated test data. Requires the \`gh\` CLI to be installed.

If the deletion fails, you may need to refresh your CLI permissions with \`gh auth refresh -s delete_repo\``;

    static flags = {
        prefix: Flags.string({
            description: "Prefix for the repos to delete, such as 'tf_'",
            required: true,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(DeleteRepos);
        const { prefix } = flags;

        const allRepos = listRepos();
        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (isEmpty(repos)) {
            this.log(`Repos found:\n${stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        this.log(`Repos to delete:\n${stringifyRepos(repos)}`);

        const confirmation = await confirm({
            message: "Continue with deletion of these repos?",
        });

        if (!confirmation) {
            return;
        }

        repos.forEach((repo) => {
            execSync(`gh repo delete ${repo.nameWithOwner} --yes`, {
                stdio: "inherit",
            });
        });
    }
}

export { DeleteRepos };
