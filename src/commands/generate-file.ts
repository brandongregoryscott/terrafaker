import { Command, Flags } from "@oclif/core";
import { generateAwsFile } from "../utilities/generators/aws-generators.js";

class GenerateFile extends Command {
    static flags = {
        name: Flags.string({
            description: "Name for the generated file, which must end in .tf",
        }),

        format: Flags.boolean({
            description:
                "Format the output terraform files. Requires `terraform` to be in your $PATH.",
            default: true,
            allowNo: true,
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(GenerateFile);

        let tfFilename = flags.name ?? "main.tf";
        if (!tfFilename.endsWith(".tf")) {
            tfFilename = `${tfFilename}.tf`;
        }

        const tfg = generateAwsFile();

        tfg.write({ format: flags.format, tfFilename });

        this.log(`✅ Successfully generated ${tfFilename}`);
    }
}

export { GenerateFile };
