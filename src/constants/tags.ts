import { upperFirst } from "lodash-es";

const SHORT_ENVIRONMENT_TAGS = ["dev", "stage", "prod"];

const LONG_ENVIRONMENT_TAGS = ["development", "staging", "production"];

const ENVIRONMENT_TAGS = [
    ...SHORT_ENVIRONMENT_TAGS,
    ...LONG_ENVIRONMENT_TAGS,
].flatMap((tag) => [tag, upperFirst(tag)]);

const SERVICE_TAGS = [
    "web-app",
    "api",
    "queue",
    "load-balancer",
    "cdn",
    "cache",
    "database",
];

export {
    SHORT_ENVIRONMENT_TAGS,
    LONG_ENVIRONMENT_TAGS,
    ENVIRONMENT_TAGS,
    SERVICE_TAGS,
};
