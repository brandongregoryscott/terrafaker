import { Flags } from "@oclif/core";
import { Providers } from "../enums/providers.js";
import { DEFAULT_TAGS } from "../constants/tags.js";
import { parseTags, stringifyTags } from "./tag-utils.js";
import type { ProviderGeneratorTags } from "./generators/provider-generator.js";

const formatFlag = Flags.boolean({
    char: "f",
    description:
        "Format the output terraform files. Requires `terraform` to be in your $PATH.",
    default: true,
    allowNo: true,
});

const quietFlag = Flags.boolean({
    char: "q",
    description: "Suppress the logging output.",
});

const resourceCountFlag = Flags.integer({
    description: "Number of resources per file to generate",
    default: 3,
});

const providerFlag = Flags.string({
    description: "Cloud provider to generate resources for",
    options: Object.values(Providers),
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
    tags: Record<string, string> | undefined;
    "no-tags": boolean;
    "chaos-tags": boolean;
}

/**
 * Utility for returning the underlying `tags` option for the `ProviderGenerator` based on various
 * flag configurations.
 */
const getTagsOption = (flags: TagsFlags): ProviderGeneratorTags => {
    const { "no-tags": noTags, "chaos-tags": chaosTags } = flags;
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
    formatFlag,
    getTagsOption,
    noTagsFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
};
