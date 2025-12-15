import type { ObjectValues } from "../types/object-values.js";

/**
 * Represents an abstract resource type that most providers offer, but may name differently.
 */
const ResourceTypes = {
    ComputeInstance: "compute-instance",
    LambdaFunction: "lambda-function",
} as const;

type ResourceType = ObjectValues<typeof ResourceTypes>;

export type { ResourceType };
export { ResourceTypes };
