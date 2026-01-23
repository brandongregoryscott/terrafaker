import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface GithubRepo {
    id: string;
    name: string;
    nameWithOwner: string;
    sshUrl: string;
}

interface PushRepoOptions {
    isPublic: boolean;
    path: string;
}

interface CloneRepoOptions {
    directory: string;
    repo: Repo;
}

interface DeleteRepoOptions {
    repo: Repo;
}

class Github {
    static async cloneRepo(options: CloneRepoOptions): Promise<void> {
        const { directory, repo } = options;
        await $`gh repo clone ${repo.fullName} ${directory}`;
    }

    static async deleteRepo(options: DeleteRepoOptions): Promise<void> {
        const { repo } = options;
        await $`gh repo delete ${repo.fullName} --yes`;
    }

    static async listRepos(): Promise<Repo[]> {
        const response =
            await $`gh repo list --json id,name,nameWithOwner,sshUrl`;
        const repos = JSON.parse(response.toString()) as GithubRepo[];
        return normalizeRepos(repos);
    }

    static async pushRepo(options: PushRepoOptions): Promise<void> {
        const { isPublic, path } = options;
        await $`cd ${path} && gh repo create --source . ${isPublic ? "--public" : "--private"} --push`;
    }
}

function normalizeRepos(repos: GithubRepo[]): Repo[] {
    return repos.map(normalizeRepo);
}

function normalizeRepo(repo: GithubRepo): Repo {
    return {
        fullName: repo.nameWithOwner,
        id: repo.id,
        name: repo.name,
        sshUrl: repo.sshUrl,
    };
}

export { Github };
