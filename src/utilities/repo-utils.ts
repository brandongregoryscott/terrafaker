import type { Repo } from "../types/repo.js";

class RepoUtils {
    static stringifyRepos(repos: Repo[]): string {
        return repos.map((repo) => `- ${repo.fullName}`).join("\n");
    }
}

export { RepoUtils };
