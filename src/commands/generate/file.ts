import { Flags } from "@oclif/core";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    formatFlag,
    providerFlag,
    quietFlag,
    resourceCountFlag,
} from "../../utilities/flags.js";
import { success } from "../../utilities/string-utils.js";
import type { Provider } from "../../enums/providers.js";
import {
    generateFileByProvider,
    randomProvider,
} from "../../utilities/generators/generator-utils.js";

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

        let tfFilename = name ?? "main.tf";
        if (!tfFilename.endsWith(".tf")) {
            tfFilename = `${tfFilename}.tf`;
        }

        const tfg = generateFileByProvider({ provider, resourceCount });

        tfg.write({ format, tfFilename });

        if (!quiet) {
            this.log(success(`Successfully generated ${tfFilename}`));
        }
    }
}

export { File };
