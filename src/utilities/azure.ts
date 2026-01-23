import { basename } from "node:path";
import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface AzureRepo {
    defaultBranch: null;
    id: string;
    isDisabled: boolean;
    isInMaintenance: boolean;
    name: string;
    parentRepository: null;
    project: {
        abbreviation: null;
        defaultTeamImageUrl: null;
        description: null;
        id: string;
        lastUpdateTime: string;
        name: string;
        revision: number;
        state: string;
        url: string;
        visibility: string;
    };
    remoteUrl: string;
    size: number;
    sshUrl: string;
    url: string;
    validRemoteUrls: null;
    webUrl: string;
}

interface PushRepoOptions {
    path: string;
}

interface CreateRepoOptions {
    name: string;
}

interface DeleteRepoOptions {
    repo: Repo;
}

interface CloneRepoOptions {
    directory: string;
    repo: Repo;
}

class Azure {
    static async cloneRepo(options: CloneRepoOptions): Promise<void> {
        const { directory, repo } = options;
        await $`git clone ${repo.sshUrl} ${directory}`;
    }

    static async deleteRepo(options: DeleteRepoOptions): Promise<void> {
        const { repo } = options;
        await $`az repos delete --id ${repo.id} --yes`;
    }

    static async listRepos() {
        const response = await $`az repos list`;
        const repos = JSON.parse(response.toString()) as AzureRepo[];
        return normalizeRepos(repos);
    }

    static async pushRepo(options: PushRepoOptions): Promise<void> {
        const { path } = options;
        const name = basename(path);
        const repo = await this.#createRepo({ name });
        await $`cd ${path} && git remote add origin ${repo.sshUrl} && git push --set-upstream origin main`;
    }

    static async #createRepo(options: CreateRepoOptions): Promise<AzureRepo> {
        const { name } = options;
        const response = await $`az repos create --name ${name}`;
        const repo = JSON.parse(response.toString()) as AzureRepo;
        return repo;
    }
}

function normalizeRepos(repos: AzureRepo[]): Repo[] {
    return repos.map(normalizeRepo);
}

function normalizeRepo(repo: AzureRepo): Repo {
    return {
        // Example webUrl: "https://dev.azure.com/brandongregoryscott/terrafaker/_git/terrafaker"
        fullName: repo.webUrl
            .replace("https://dev.azure.com/", "")
            .replace("/_git/", "/"),
        id: repo.id,
        name: repo.name,
        sshUrl: repo.sshUrl,
    };
}

export { Azure };
