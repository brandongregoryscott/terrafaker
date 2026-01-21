interface Repo {
    /**
     * Repo name with owner, i.e. brandongregoryscott/terrafaker
     */
    fullName: string;

    /**
     * Name of the repo, i.e. terrafaker
     */
    name: string;
}

export type { Repo };
