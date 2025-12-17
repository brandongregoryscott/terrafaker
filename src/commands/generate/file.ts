import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    chaosTagsFlag,
    formatFlag,
    getTagsOption,
    noTagsFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
} from "../../utilities/flags.js";
import { formatTfFileName, success } from "../../utilities/string-utils.js";
import type { Provider } from "../../enums/providers.js";
import { randomProvider } from "../../utilities/generators/generator-utils.js";
import { FileGenerator } from "../../utilities/generators/file-generator.js";
import { DEFAULT_TAGS } from "../../constants/tags.js";
import type { ProviderGeneratorTags } from "../../utilities/generators/provider-generator.js";

class File extends BaseCommand {
    static description = "Generates a terraform file.";

    static flags = {
        "chaos-tags": chaosTagsFlag,
        format: formatFlag,
        name: Flags.string({
            description: "Name for the generated file, which must end in .tf",
        }),
        "no-tags": noTagsFlag,
        provider: providerFlag,
        quiet: quietFlag,
        "resource-count": resourceCountFlag,
        tags: tagsFlag(),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(File);
        const { name, quiet, format, "resource-count": resourceCount } = flags;
        const tags = getTagsOption(flags);
        const provider =
            (flags.provider as Provider | undefined) ?? randomProvider();
        const fileName = formatTfFileName(name ?? "main.tf");

        FileGenerator.generate({
            fileName,
            provider,
            resourceCount,
            format,
            tags,
        });

        if (!quiet) {
            this.log(success(`Successfully generated '${fileName}'`));
        }
    }
}

export { File };
