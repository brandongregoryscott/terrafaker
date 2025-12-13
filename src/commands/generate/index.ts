import { BaseCommand } from "../../utilities/base-command.js";

class Generate extends BaseCommand {
    static hidden = true;

    static description = "Commands for generating terraform files.";

    async run(): Promise<void> {
        await this.showHelp();
    }
}

export { Generate };
