import { Flags } from "@oclif/core";
import type { ProviderGeneratorTags } from "./generators/provider-generator.js";
import { DEFAULT_TAGS } from "../constants/tags.js";
import { Providers } from "../enums/providers.js";
import { VcsProviders } from "../enums/vcs-providers.js";
import { parseTags, stringifyTags } from "./tag-utils.js";

const formatFlag = Flags.boolean({
    allowNo: true,
    char: "f",
    default: true,
    description:
        "Format the output terraform files. Requires `terraform` to be in your $PATH.",
});

const quietFlag = Flags.boolean({
    char: "q",
    description: "Suppress the logging output.",
});

const resourceCountFlag = Flags.integer({
    default: 3,
    description: "Number of resources per file to generate",
});

const providerFlag = Flags.string({
    description: "Cloud provider to generate resources for",
    options: Object.values(Providers),
});

const vcsProviderFlag = Flags.string({
    default: VcsProviders.GitHub,
    description: "Remote version control system to interact with",
    options: Object.values(VcsProviders),
});

const requiredPrefixFlag = Flags.string({
    description: "Prefix for the repos, such as 'tf_'",
    required: true,
});

const directoryFlag = Flags.string({
    default: ".",
    description: "Directory to create the repo(s) in",
});

const TAGS_WITH_VALUES = {
    Service: "web-app",
    Team: "core",
};

const TAGS_WITH_SPACES = {
    Service: "my awesome web app",
    "Team Name": "The Core Team",
};

const tagsFlag = Flags.custom<Record<string, string>>({
    description: `[default: ${stringifyTags(DEFAULT_TAGS)}] Custom tags to use for generated resources. Should be a comma-separated list of tag names to generate random values for, or tag names with values delimited by a colon.

Examples:

Specify just tag keys to have a random value generated.
    --tags Service,Team → ${JSON.stringify({ Service: "(random value)", Team: "(random value)" })}

Specify value for a key with the : delimiter. This can be mixed with just keys that are randomly generated.
    --tags Service:web-app,Team → ${JSON.stringify({ Service: "web-app", Team: "(random value)" })}
    --tags ${stringifyTags(TAGS_WITH_VALUES)} → ${JSON.stringify(TAGS_WITH_VALUES)}

When specifying a key or value that has a space in it, the entire tag string needs to be quoted.
    --tags "${stringifyTags(TAGS_WITH_SPACES)}" → ${JSON.stringify(TAGS_WITH_SPACES)}
`,
    exclusive: ["chaos-tags", "no-tags"],
    parse: async (input: string) => parseTags(input),
});

const noTagsFlag = Flags.boolean({
    description: "Disable any tag generation",
    exclusive: ["tags", "chaos-tags"],
});

const chaosTagsFlag = Flags.boolean({
    description: "Generate random tag keys & values",
    exclusive: ["tags", "no-tags"],
});

interface TagsFlags {
    "chaos-tags": boolean;
    "no-tags": boolean;
    tags: Record<string, string> | undefined;
}

/**
 * Utility for returning the underlying `tags` option for the `ProviderGenerator` based on various
 * flag configurations.
 */
const getTagsOption = (flags: TagsFlags): ProviderGeneratorTags => {
    const { "chaos-tags": chaosTags, "no-tags": noTags } = flags;
    let tags: ProviderGeneratorTags = flags.tags ?? DEFAULT_TAGS;

    if (chaosTags) {
        tags = "chaos";
    }

    if (noTags) {
        tags = undefined;
    }

    return tags;
};

export {
    chaosTagsFlag,
    directoryFlag,
    formatFlag,
    getTagsOption,
    noTagsFlag,
    providerFlag,
    quietFlag,
    requiredPrefixFlag,
    resourceCountFlag,
    tagsFlag,
    vcsProviderFlag,
};
