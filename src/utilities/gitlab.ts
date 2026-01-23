import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface GitlabRepo {
    id: number;
    marked_for_deletion_on: null | string;
    name: string;
    path_with_namespace: string;
    ssh_url_to_repo: string;
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

class Gitlab {
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
        const repos = JSON.parse(response.toString()) as GitlabRepo[];
        return normalizeRepos(repos);
    }

    static async pushRepo(options: PushRepoOptions): Promise<void> {
        const { isPublic, path } = options;
        await $`cd ${path} && glab repo create ${isPublic ? "--public" : "--private"} && git push --set-upstream origin main`;
    }
}

function normalizeRepos(repos: GitlabRepo[]): Repo[] {
    return repos
        .filter((repo) => repo.marked_for_deletion_on == null)
        .map(normalizeRepo);
}

function normalizeRepo(repo: GitlabRepo): Repo {
    return {
        fullName: repo.path_with_namespace,
        id: repo.id.toString(),
        name: repo.name,
        sshUrl: repo.ssh_url_to_repo,
    };
}

export { Gitlab };
