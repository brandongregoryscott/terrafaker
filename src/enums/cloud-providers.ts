import type { ObjectValues } from "../types/object-values.js";

const CloudProviders = {
    AWS: "aws",
    Azure: "azure",
    GCP: "gcp",
} as const;

type CloudProvider = ObjectValues<typeof CloudProviders>;

export type { CloudProvider };
export { CloudProviders };
