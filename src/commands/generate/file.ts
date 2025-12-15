import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    formatFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
} from "../../utilities/flags.js";
import { formatTfFileName, success } from "../../utilities/string-utils.js";
import type { Provider } from "../../enums/providers.js";
import { randomProvider } from "../../utilities/generators/generator-utils.js";
import { FileGenerator } from "../../utilities/generators/file-generator.js";

class File extends BaseCommand {
    static description = "Generates a terraform file.";

    static flags = {
        name: Flags.string({
            description: "Name for the generated file, which must end in .tf",
        }),

        provider: providerFlag,

        "resource-count": resourceCountFlag,

        format: formatFlag,

        quiet: quietFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(File);
        const { name, quiet, format, "resource-count": resourceCount } = flags;
        const provider =
            (flags.provider as Provider | undefined) ?? randomProvider();
        const fileName = formatTfFileName(name ?? "main.tf");

        FileGenerator.generate({
            fileName,
            provider,
            resourceCount,
            format,
        });

        if (!quiet) {
            this.log(success(`Successfully generated ${fileName}`));
        }
    }
}

export { File };
