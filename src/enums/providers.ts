import type { ObjectValues } from "../types/object-values.js";

const Providers = {
    AWS: "aws",
    GCP: "gcp",
    Azure: "azure",
} as const;

type Provider = ObjectValues<typeof Providers>;

export type { Provider };
export { Providers };
