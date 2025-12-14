import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../utilities/base-command.js";
import { stringifySingleLineArray } from "../../utilities/string-utils.js";
import { compact } from "lodash-es";

const EXAMPLE = `c4d-standard-2	2	7	No	Up to 10	N/A`;

class FormatTsv extends BaseCommand {
    static hidden = true;

    static description =
        "Utility command for formatting a TSV (tab-separated value) into an array. Primarily used for parsing data from the GCP docs.";

    static flags = {
        index: Flags.integer({
            char: "i",
            description: "Column index to pull from each line.",
            default: 0,
        }),
    };

    static args = {
        tsv: Args.string({
            required: true,
            description: `Tab-separated value to format into a string array, i.e. '${EXAMPLE}'.
If the string is multiple lines (which it generally is), the specified column index from each line will be placed in the array.`,
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(FormatTsv);
        const { index } = flags;
        const { tsv } = args;

        const lines = tsv.split("\n");
        const values = compact(lines.map((line) => splitTsv(line)[index]));

        this.log(stringifySingleLineArray(values));
    }
}

const splitTsv = (tsv: string): string[] =>
    compact(tsv.split("\t").map((value) => value.trim()));

export { FormatTsv };
