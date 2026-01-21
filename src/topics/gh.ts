import type { Topic } from "@oclif/core/interfaces";
import { HelpMessages } from "../enums/help-messages.js";

const gh: Topic = {
    description: `Utility commands that wrap the \`gh\` CLI. ${HelpMessages.RequiresGhCli}`,
    name: "gh",
};

export { gh };
