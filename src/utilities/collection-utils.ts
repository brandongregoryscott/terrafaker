import { upperFirst } from "lodash-es";

const stringifySingleLineArray = (values: string[]): string =>
    `[${values.map((value) => `"${value}"`).join(", ")}]`;

const mapUpperFirstVariants = (values: string[]): string[] =>
    values.flatMap((value) => [value, upperFirst(value)]);

export { mapUpperFirstVariants, stringifySingleLineArray };
