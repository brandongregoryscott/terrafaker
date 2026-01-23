import type { ObjectValues } from "../types/object-values.js";

const VcsProviders = {
    Azure: "azure",
    Github: "github",
    Gitlab: "gitlab",
} as const;

const VcsProviderNames = {
    Azure: "Azure",
    Github: "GitHub",
    Gitlab: "GitLab",
} as const;

type VcsProvider = ObjectValues<typeof VcsProviders>;

type VcsProviderName = ObjectValues<typeof VcsProviderNames>;

export type { VcsProvider, VcsProviderName };
export { VcsProviderNames, VcsProviders };
