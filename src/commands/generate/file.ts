import { Flags } from "@oclif/core";
import { generateAwsFile } from "../../utilities/generators/aws-generators.js";
import { BaseCommand } from "../../utilities/base-command.js";
import { formatFlag } from "../../utilities/flags.js";
import { success } from "../../utilities/string-utils.js";

class File extends BaseCommand {
    static flags = {
        name: Flags.string({
            description: "Name for the generated file, which must end in .tf",
        }),

        format: formatFlag,
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(File);

        let tfFilename = flags.name ?? "main.tf";
        if (!tfFilename.endsWith(".tf")) {
            tfFilename = `${tfFilename}.tf`;
        }

        const tfg = generateAwsFile();

        tfg.write({ format: flags.format, tfFilename });

        this.log(success(`Successfully generated ${tfFilename}`));
    }
}

export { File };
