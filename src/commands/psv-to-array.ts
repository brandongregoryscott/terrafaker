import { Command, Flags } from "@oclif/core";

class PsvToArray extends Command {
    static flags = {
        psv: Flags.string({
            description:
                "Pipe-separated value to convert to a string array, i.e. 'm5a.large | m5a.xlarge | m5a.2xlarge'",
        }),
        table: Flags.string({
            description:
                "Table with pipe-separated values, where the first column is the type, i.e. 'M5	m5.large | m5.xlarge | m5.2xlarge | m5.4xlarge | m5.8xlarge | m5.12xlarge | m5.16xlarge | m5.24xlarge | m5.metal' ",
        }),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(PsvToArray);

        const { psv, table } = flags;

        if (psv !== undefined) {
            const stringArray = splitPsv(psv);

            this.log(JSON.stringify(stringArray));
        }

        if (table !== undefined) {
            const lines = table.split("\n");
            const value: Record<string, string[]> = {};
            lines.forEach((line) => {
                const [type, psv] = line.split("\t");

                value[type] = splitPsv(psv);
            });

            this.log(stringifyWithSingleLineArrays(value));
        }
    }
}

const splitPsv = (psv: string): string[] =>
    psv.split("|").map((value) => value.trim());

/**
 * In an effort to reduce the size of the AWS constants file, we're custom stringifying the object
 * to ensure the arrays are a single line.
 */
const stringifyWithSingleLineArrays = (object: Record<string, string[]>) => {
    const lines: string[] = ["{"];
    Object.entries(object).forEach(([key, value]) => {
        lines.push(
            `\t"${key}": [${value.map((value) => `"${value}"`).join(", ")}],`
        );
    });

    lines.push("}");

    return lines.join("\n");
};

export { PsvToArray };
