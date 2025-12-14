import type { ObjectValues } from "../types/object-values.js";

const Providers = {
    AWS: "aws",
    GCP: "gcp",
} as const;

type Provider = ObjectValues<typeof Providers>;

export type { Provider };
export { Providers };
