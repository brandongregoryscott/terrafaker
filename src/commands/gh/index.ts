import { BaseCommand } from "../../utilities/base-command.js";
import { HelpMessages } from "../../enums/help-messages.js";

class Gh extends BaseCommand {
    static hidden = true;

    static description = `Utility commands that wrap the \`gh\` CLI. ${HelpMessages.RequiresGhCli}`;

    async run(): Promise<void> {
        await this.showHelp();
    }
}

export { Gh };
