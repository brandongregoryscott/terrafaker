import { faker } from "@faker-js/faker";

const slugify = (value: string): string =>
    faker.helpers.slugify(value).toLowerCase();

const snakeSlugify = (value: string): string =>
    slugify(value).replaceAll("-", "_");

export { slugify, snakeSlugify };
