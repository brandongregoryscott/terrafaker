import { HELP_MESSAGES } from "../../constants/help-messages.js";
import { BaseCommand } from "../../utilities/base-command.js";

class Gh extends BaseCommand {
    static hidden = true;

    static description = `Utility commands that wrap the \`gh\` CLI. ${HELP_MESSAGES.RequiresGhCli}`;

    async run(): Promise<void> {
        await this.showHelp();
    }
}

export { Gh };
