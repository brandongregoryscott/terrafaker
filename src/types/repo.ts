interface Repo {
    /**
     * Repo name with owner, i.e. brandongregoryscott/terrafaker
     */
    fullName: string;

    /**
     * Unique identifier for the repo
     */
    id: string;

    /**
     * Name of the repo, i.e. terrafaker
     */
    name: string;

    /**
     * URL for cloning/pushing
     */
    sshUrl: string;
}

export type { Repo };
