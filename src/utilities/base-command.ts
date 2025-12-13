import { Command, loadHelpClass } from "@oclif/core";

abstract class BaseCommand extends Command {
    public async showHelp(): Promise<void> {
        const HelpClass = await loadHelpClass(this.config);
        const help = new HelpClass(this.config);
        await help.showHelp([this.id ?? ""]);
    }
}

export { BaseCommand };
