import { Flags } from "@oclif/core";
import type { CloudProvider } from "../enums/cloud-providers.js";
import type { IacType } from "../enums/iac-types.js";
import type { VcsProvider } from "../enums/vcs-providers.js";
import type { GeneratorTagsOption } from "./generators/provider-generator.js";
import { DEFAULT_TAGS } from "../constants/tags.js";
import { CloudProviders } from "../enums/cloud-providers.js";
import { FlagNames } from "../enums/flag-names.js";
import { IacTypes } from "../enums/iac-types.js";
import { VcsProviders } from "../enums/vcs-providers.js";
import { EnumUtils } from "./enum-utils.js";
import { TagUtils } from "./tag-utils.js";

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

const iacTypeFlag = Flags.custom<IacType>({
    default: IacTypes.Terraform,
    description: `Infrastructure-as-code to generate. CloudFormation is only valid when cloud-provider is '${CloudProviders.AWS}'.`,
    options: Object.values(IacTypes),
    parse: async (input) => EnumUtils.parseValue(IacTypes, input),
});

const cloudProviderFlag = Flags.custom<CloudProvider>({
    description: "Cloud provider to generate resources for",
    options: Object.values(CloudProviders),
    parse: async (input) => EnumUtils.parseValue(CloudProviders, input),
    relationships: [
        {
            flags: [
                {
                    name: FlagNames.IacType,
                    when: async (flags) =>
                        flags[FlagNames.IacType] === IacTypes.CloudFormation &&
                        flags[FlagNames.CloudProvider] !== CloudProviders.AWS,
                },
            ],
            // Exclusive: `cloud-provider` cannot be used with a value other than `aws` when `iac-type` is cloudformation
            type: "none",
        },
    ],
});

const vcsProviderFlag = Flags.custom<VcsProvider>({
    default: VcsProviders.Github,
    description: "Remote version control system to interact with",
    options: Object.values(VcsProviders),
    parse: async (input) => EnumUtils.parseValue(VcsProviders, input),
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
    description: `[default: ${TagUtils.stringify(DEFAULT_TAGS)}] Custom tags to use for generated resources. Should be a comma-separated list of tag names to generate random values for, or tag names with values delimited by a colon.

Examples:

Specify just tag keys to have a random value generated.
    --tags Service,Team → ${JSON.stringify({ Service: "(random value)", Team: "(random value)" })}

Specify value for a key with the : delimiter. This can be mixed with just keys that are randomly generated.
    --tags Service:web-app,Team → ${JSON.stringify({ Service: "web-app", Team: "(random value)" })}
    --tags ${TagUtils.stringify(TAGS_WITH_VALUES)} → ${JSON.stringify(TAGS_WITH_VALUES)}

When specifying a key or value that has a space in it, the entire tag string needs to be quoted.
    --tags "${TagUtils.stringify(TAGS_WITH_SPACES)}" → ${JSON.stringify(TAGS_WITH_SPACES)}
`,
    exclusive: ["chaos-tags", "no-tags"],
    parse: async (input: string) => TagUtils.parse(input),
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
    [FlagNames.ChaosTags]: boolean;
    [FlagNames.NoTags]: boolean;
    [FlagNames.Tags]: Record<string, string> | undefined;
}

/**
 * Utility for returning the underlying `tags` option for the `ProviderGenerator` based on various
 * flag configurations.
 */
function getTagsOption(flags: TagsFlags): GeneratorTagsOption {
    const { "chaos-tags": chaosTags, "no-tags": noTags } = flags;
    let tags: GeneratorTagsOption = flags.tags ?? DEFAULT_TAGS;

    if (chaosTags) {
        tags = "chaos";
    }

    if (noTags) {
        tags = undefined;
    }

    return tags;
}

/**
 * Converts a kebab-case string literal type to camelCase.
 * e.g., "cloud-provider" -> "cloudProvider"
 */
type KebabToCamelCase<S extends string> =
    S extends `${infer First}-${infer Rest}`
        ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
        : S;

/**
 * Converts all kebab-case keys of an object type to camelCase.
 */
type CamelCaseFlags<T> = {
    [K in keyof T as K extends string ? KebabToCamelCase<K> : K]: T[K];
};

/**
 * Converts a kebab-case string to camelCase.
 */
function kebabToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Converts all kebab-case keys in an object to camelCase.
 * Useful for converting oclif parsed flags to standard JS/TS naming conventions.
 *
 * @example
 * const { flags } = await this.parse(MyCommand);
 * const { cloudProvider, iacType, resourceCount } = toCamelCaseFlags(flags);
 */
function toCamelCaseFlags<T extends Record<string, unknown>>(
    flags: T
): CamelCaseFlags<T> {
    const result = {} as CamelCaseFlags<T>;
    for (const key of Object.keys(flags)) {
        const camelKey = kebabToCamelCase(key) as keyof CamelCaseFlags<T>;
        result[camelKey] = flags[key] as CamelCaseFlags<T>[typeof camelKey];
    }
    return result;
}

export {
    chaosTagsFlag,
    cloudProviderFlag,
    directoryFlag,
    formatFlag,
    getTagsOption,
    iacTypeFlag,
    noTagsFlag,
    quietFlag,
    requiredPrefixFlag,
    resourceCountFlag,
    tagsFlag,
    toCamelCaseFlags,
    vcsProviderFlag,
};
