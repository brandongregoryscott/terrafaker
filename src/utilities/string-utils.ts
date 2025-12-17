import { faker } from "@faker-js/faker";
import { ux } from "@oclif/core";

const slugify = (value: string): string =>
    faker.helpers.slugify(value).toLowerCase();

const snakeSlugify = (value: string): string =>
    slugify(value).replaceAll("-", "_");

const success = (message: string) => `${ux.colorize("green", "✓")} ${message}`;

const warn = (message: string) => `${ux.colorize("yellow", "⚠")} ${message}`;

const formatTfFileName = (fileName: string): string =>
    fileName.endsWith(".tf") ? fileName : `${fileName}.tf`;

export { formatTfFileName, slugify, snakeSlugify, success, warn };
