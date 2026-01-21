import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface GitLabRepo {
    marked_for_deletion_on: null | string;
    name: string;
    path_with_namespace: string;
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

class GitLab {
    static async cloneRepo(options: CloneRepoOptions): Promise<void> {
        const { directory, repo } = options;
        await $`glab repo clone ${repo.fullName} ${directory}`;
    }

    static async deleteRepo(options: DeleteRepoOptions): Promise<void> {
        const { repo } = options;
        await $`glab repo delete ${repo.fullName} --yes`;
    }

    static async listRepos(): Promise<Repo[]> {
        const response = await $`glab repo list --output json`;
        const repos = JSON.parse(response.toString()) as GitLabRepo[];
        return normalizeRepos(repos);
    }

    static async pushRepo(options: PushRepoOptions): Promise<void> {
        const { isPublic, path } = options;
        await $`cd ${path} && glab repo create ${isPublic ? "--public" : "--private"} && git push --set-upstream origin main`;
    }
}

function normalizeRepos(repos: GitLabRepo[]): Repo[] {
    return repos
        .filter((repo) => repo.marked_for_deletion_on == null)
        .map((repo) => ({
            fullName: repo.path_with_namespace,
            name: repo.name,
        }));
}

export type { GitLabRepo };
export { GitLab };
