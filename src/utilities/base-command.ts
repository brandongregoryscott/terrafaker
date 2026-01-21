import { confirm } from "@inquirer/prompts";
import { Command, loadHelpClass } from "@oclif/core";
import { isEmpty } from "lodash-es";
import path from "path";
import type { Repo } from "../types/repo.js";
import { RepoUtils } from "./repo-utils.js";

interface CloneReposOptions {
    cloneRepo: (options: CloneRepoOptions) => Promise<void>;
    directory: string;
    listRepos: () => Promise<Repo[]>;
    prefix: string;
}

interface CloneRepoOptions {
    directory: string;
    repo: Repo;
}

interface DeleteRepoOptions {
    repo: Repo;
}

interface DeleteReposOptions {
    deleteRepo: (options: DeleteRepoOptions) => Promise<void>;
    listRepos: () => Promise<Repo[]>;
    prefix: string;
}

abstract class BaseCommand extends Command {
    public async cloneRepos(options: CloneReposOptions): Promise<void> {
        const {
            cloneRepo,
            directory: directoryOption,
            listRepos,
            prefix,
        } = options;
        const allRepos = await listRepos();
        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (isEmpty(repos)) {
            this.log(`Repos found:\n${RepoUtils.stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        this.log(`Repos to clone:\n${RepoUtils.stringifyRepos(repos)}`);

        const confirmation = await confirm({
            message: "Continue with cloning these repos?",
        });

        if (!confirmation) {
            return;
        }

        for (const repo of repos) {
            const directory = path.resolve(
                process.cwd(),
                directoryOption,
                repo.name
            );

            await cloneRepo({ directory, repo });
        }
    }

    public async deleteRepos(options: DeleteReposOptions): Promise<void> {
        const { deleteRepo, listRepos, prefix } = options;
        const allRepos = await listRepos();

        const repos = allRepos.filter((repo) => repo.name.startsWith(prefix));

        if (isEmpty(repos)) {
            this.log(`Repos found:\n${RepoUtils.stringifyRepos(allRepos)}`);
            this.log(`No repos found with prefix '${prefix}'`);
            this.exit();
        }

        this.log(`Repos to delete:\n${RepoUtils.stringifyRepos(repos)}`);

        const confirmation = await confirm({
            message: "Continue with deletion of these repos?",
        });

        if (!confirmation) {
            return;
        }

        for (const repo of repos) {
            await deleteRepo({ repo });
        }
    }

    public async showHelp(): Promise<void> {
        const HelpClass = await loadHelpClass(this.config);
        const help = new HelpClass(this.config);
        await help.showHelp([this.id ?? ""]);
    }
}

export { BaseCommand };
