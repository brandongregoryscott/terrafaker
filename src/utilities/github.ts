import { $ } from "zx";
import type { Repo } from "../types/repo.js";

interface GithubRepo {
    id: string;
    name: string;
    nameWithOwner: string;
    sshUrl: string;
}

interface GithubPullRequest {
    createdAt: string;
    headRefName: string;
    number: number;
    title: string;
}

interface GithubRepoView {
    defaultBranchRef: {
        name: string;
    };
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

    static async getDefaultBranch(repoFullName: string): Promise<string> {
        const response =
            await $`gh repo view ${repoFullName} --json defaultBranchRef`;
        const repoView = JSON.parse(response.toString()) as GithubRepoView;
        return repoView.defaultBranchRef.name;
    }

    static async listPullRequests(options: {
        repoFullName: string;
        state?: "all" | "closed" | "open";
    }): Promise<GithubPullRequest[]> {
        const { repoFullName, state = "open" } = options;
        const response =
            await $`gh pr list --repo ${repoFullName} --state ${state} --limit 250 --json number,headRefName,title,createdAt`;
        return JSON.parse(response.toString()) as GithubPullRequest[];
    }

    static async listRepos(): Promise<Repo[]> {
        const response =
            await $`gh repo list --limit 250 --json id,name,nameWithOwner,sshUrl`;
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
