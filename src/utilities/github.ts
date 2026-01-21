import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface GitHubRepo {
    name: string;
    nameWithOwner: string;
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

class GitHub {
    static async cloneRepo(options: CloneRepoOptions): Promise<void> {
        const { directory, repo } = options;
        await $`gh repo clone ${repo.fullName} ${directory}`;
    }

    static async deleteRepo(options: DeleteRepoOptions): Promise<void> {
        const { repo } = options;
        await $`gh repo delete ${repo.fullName} --yes`;
    }

    static async listRepos(): Promise<Repo[]> {
        const response = await $`gh repo list --json name,nameWithOwner`;
        const repos = JSON.parse(response.toString()) as GitHubRepo[];
        return normalizeRepos(repos);
    }

    static async pushRepo(options: PushRepoOptions): Promise<void> {
        const { isPublic, path } = options;
        await $`cd ${path} && gh repo create --source . ${isPublic ? "--public" : "--private"} --push`;
    }
}

function normalizeRepos(repos: GitHubRepo[]): Repo[] {
    return repos.map((repo) => ({
        fullName: repo.nameWithOwner,
        name: repo.name,
    }));
}

export type { GitHubRepo };
export { GitHub };
