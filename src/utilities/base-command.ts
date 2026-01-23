import { confirm } from "@inquirer/prompts";
import { Command, loadHelpClass } from "@oclif/core";
import { isEmpty } from "lodash-es";
import path from "path";
import { $ as _$ } from "zx";
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

const $ = _$({ nothrow: true, quiet: true });

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

    public async isAzureCliAuthenticated(): Promise<boolean> {
        const { ok } = await $`az account get-access-token`;
        return ok;
    }

    public async isAzureCliDefaultOrganizationConfigured(): Promise<boolean> {
        const { ok, stdout } = await $`az devops configure --list`;
        if (!ok) {
            return false;
        }

        const lines = stdout.split("\n");
        const needle = "organization =";
        const organizationLine = findLine(needle, lines);
        const organizationName = organizationLine
            ?.trim()
            .replace(needle, "")
            .trim();
        return !isEmpty(organizationName);
    }

    public async isAzureCliDefaultProjectConfigured(): Promise<boolean> {
        const { ok, stdout } = await $`az devops configure --list`;
        if (!ok) {
            return false;
        }

        const lines = stdout.split("\n");
        const needle = "project =";
        const projectLine = findLine(needle, lines);
        const projectName = projectLine?.trim().replace(needle, "").trim();
        return !isEmpty(projectName);
    }

    public async isAzureCliDevopsExtensionInstalled(): Promise<boolean> {
        const { ok, stdout } = await $`az extension list`;

        if (!ok) {
            return false;
        }

        const extensions = JSON.parse(stdout) as Array<{
            experimental: boolean;
            extensionType: string;
            name: string;
            path: string;
            preview: boolean;
            version: string;
        }>;

        return extensions.some(
            (extension) => extension.name === "azure-devops"
        );
    }

    public async isAzureCliInstalled(): Promise<boolean> {
        const { ok } = await $`which az`;
        return ok;
    }

    public async isGithubCliAuthenticated(): Promise<boolean> {
        const { ok } = await $`gh auth status`;
        return ok;
    }

    public async isGithubCliInstalled(): Promise<boolean> {
        const { ok } = await $`which gh`;
        return ok;
    }

    public async isGitlabCliAuthenticated(): Promise<boolean> {
        const { ok } = await $`glab auth status`;
        return ok;
    }

    public async isGitlabCliInstalled(): Promise<boolean> {
        const { ok } = await $`which glab`;
        return ok;
    }

    public async showHelp(): Promise<void> {
        const HelpClass = await loadHelpClass(this.config);
        const help = new HelpClass(this.config);
        await help.showHelp([this.id ?? ""]);
    }
}

function findLine(needle: string, haystack: string[]): string | undefined {
    return haystack.find((line) => line.includes(needle))?.trim();
}

export { BaseCommand };
