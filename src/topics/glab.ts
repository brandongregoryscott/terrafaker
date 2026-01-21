import type { Topic } from "@oclif/core/interfaces";
import { HelpMessages } from "../enums/help-messages.js";

const glab: Topic = {
    description: `Utility commands that wrap the \`glab\` CLI. ${HelpMessages.RequiresGlabCli}`,
    name: "glab",
};

export { glab };
