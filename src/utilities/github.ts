import { execSync } from "node:child_process";

interface Repo {
    name: string;
    nameWithOwner: string;
}

const listRepos = (): Repo[] =>
    JSON.parse(execSync(`gh repo list --json name,nameWithOwner`).toString());

const stringifyRepos = (repos: Repo[]): string =>
    repos.map((repo) => `- ${repo.nameWithOwner}`).join("\n");

export type { Repo };
export { listRepos, stringifyRepos };
