import { Flags } from "@oclif/core";
import type { Provider } from "../../enums/providers.js";
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
import { FileGenerator } from "../../utilities/generators/file-generator.js";
import { randomProvider } from "../../utilities/generators/generator-utils.js";
import { StringUtils } from "../../utilities/string-utils.js";

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
        const { format, name, quiet, "resource-count": resourceCount } = flags;
        const tags = getTagsOption(flags);
        const provider =
            (flags.provider as Provider | undefined) ?? randomProvider();
        const fileName = StringUtils.formatTfFileName(name ?? "main.tf");

        FileGenerator.generate({
            fileName,
            format,
            provider,
            resourceCount,
            tags,
        });

        if (!quiet) {
            this.log(
                StringUtils.success(`Successfully generated '${fileName}'`)
            );
        }
    }
}

export { File };
