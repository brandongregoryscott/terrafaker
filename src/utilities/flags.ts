import { Flags } from "@oclif/core";
import { Providers } from "../enums/providers.js";

const formatFlag = Flags.boolean({
    char: "f",
    description:
        "Format the output terraform files. Requires `terraform` to be in your $PATH.",
    default: true,
    allowNo: true,
});

const quietFlag = Flags.boolean({
    char: "q",
    description: "Suppress the logging output.",
});

const resourceCountFlag = Flags.integer({
    description: "Number of resources per file to generate",
    default: 3,
});

const providerFlag = Flags.string({
    description: "Cloud provider to generate resources for",
    options: Object.values(Providers),
});

export { formatFlag, providerFlag, quietFlag, resourceCountFlag };
