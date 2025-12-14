import { faker } from "@faker-js/faker";
import { ux } from "@oclif/core";

const slugify = (value: string): string =>
    faker.helpers.slugify(value).toLowerCase();

const snakeSlugify = (value: string): string =>
    slugify(value).replaceAll("-", "_");

const success = (message: string) => `${ux.colorize("green", "✓")} ${message}`;

const stringifySingleLineArray = (values: string[]): string =>
    `[${values.map((value) => `"${value}"`).join(", ")}]`;

export { slugify, snakeSlugify, stringifySingleLineArray, success };
