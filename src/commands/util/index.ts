import { BaseCommand } from "../../utilities/base-command.js";

class Util extends BaseCommand {
    static description = "Miscellaneous utility commands.";

    static hidden = true;

    async run(): Promise<void> {
        await this.showHelp();
    }
}

export { Util };
