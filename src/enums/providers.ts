import type { ObjectValues } from "../types";

const Providers = {
    AWS: "aws",
    GCP: "gcp",
} as const;

type Provider = ObjectValues<typeof Providers>;

export type { Provider };
export { Providers };
