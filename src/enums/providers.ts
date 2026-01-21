import type { ObjectValues } from "../types/object-values.js";

const Providers = {
    AWS: "aws",
    Azure: "azure",
    GCP: "gcp",
} as const;

type Provider = ObjectValues<typeof Providers>;

export type { Provider };
export { Providers };
