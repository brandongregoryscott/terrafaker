import type { ObjectValues } from "../types/object-values.js";

const VcsProviders = {
    GitHub: "github",
    GitLab: "gitlab",
} as const;

type VcsProvider = ObjectValues<typeof VcsProviders>;

export type { VcsProvider };
export { VcsProviders };
