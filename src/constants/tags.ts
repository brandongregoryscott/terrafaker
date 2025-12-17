import { mapUpperFirstVariants } from "../utilities/collection-utils.js";

const SHORT_ENVIRONMENT_TAGS = ["dev", "stage", "prod"];

const LONG_ENVIRONMENT_TAGS = ["development", "staging", "production"];

const ENVIRONMENT_TAGS = mapUpperFirstVariants([
    ...SHORT_ENVIRONMENT_TAGS,
    ...LONG_ENVIRONMENT_TAGS,
]);

const SERVICE_TAGS = [
    "web-app",
    "api",
    "queue",
    "load-balancer",
    "cdn",
    "cache",
    "database",
];

const DEFAULT_TAGS: Record<string, string> = {
    Environment: "Dev",
    Service: "service",
};

const TAG_KEYS = mapUpperFirstVariants([
    "environment",
    "env",
    "service",
    "name",
    "team",
    "business",
    "department",
    "dept",
]);

export {
    DEFAULT_TAGS,
    ENVIRONMENT_TAGS,
    LONG_ENVIRONMENT_TAGS,
    SERVICE_TAGS,
    SHORT_ENVIRONMENT_TAGS,
    TAG_KEYS,
};
