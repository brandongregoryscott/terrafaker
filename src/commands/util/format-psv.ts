import { Args } from "@oclif/core";
import { compact, first } from "lodash-es";
import { BaseCommand } from "../../utilities/base-command.js";
import { stringifySingleLineArray } from "../../utilities/string-utils.js";

const EXAMPLE_INSTANCE_TYPES = ["m5.large", "m5.xlarge", "m5.2xlarge"];

class FormatPsv extends BaseCommand {
    static hidden = true;

    static description =
        "Utility command for formatting a PSV (pipe-separated value) into an array or object with array values. Primarily used for parsing data from the AWS docs.";

    static args = {
        psv: Args.string({
            required: true,
            description: `Pipe-separated value to format into a string array, i.e. '${EXAMPLE_INSTANCE_TYPES.join(" | ")}'.
If the string is multiple lines, it will be formatted into an object where the key is the first column before a tab, i.e. 'M5\t${EXAMPLE_INSTANCE_TYPES.join(" | ")}'`,
        }),
    };

    async run(): Promise<void> {
        const { args } = await this.parse(FormatPsv);
        const { psv } = args;

        const lines = psv.split("\n");

        if (lines.length === 1) {
            const values = splitPsv(first(lines) ?? "");
            this.log(stringifySingleLineArray(values));
            return;
        }

        const value = lines.reduce(
            (accumulated, line) => {
                const [type, psv] = line.split("\t");
                accumulated[type] = splitPsv(psv);
                return accumulated;
            },
            {} as Record<string, string[]>
        );

        this.log(stringifyObjectWithSingleLineArrays(value));
    }
}

const splitPsv = (psv: string): string[] =>
    compact(psv.split("|").map((value) => value.trim()));

/**
 * In an effort to reduce the size of the AWS constants file, we're custom stringifying the object
 * to ensure the arrays are a single line.
 */
const stringifyObjectWithSingleLineArrays = (
    object: Record<string, string[]>
) => {
    const lines: string[] = ["{"];

    Object.entries(object).forEach(([key, values]) => {
        lines.push(`\t"${key}": ${stringifySingleLineArray(values)},`);
    });

    lines.push("}");

    return lines.join("\n");
};

export { FormatPsv };
