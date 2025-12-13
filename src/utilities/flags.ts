import { Flags } from "@oclif/core";

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

export { formatFlag, quietFlag };
