import { faker } from "@faker-js/faker";
import { snakeSlugify } from "../string-utils.js";
import { TerraformGenerator } from "terraform-generator";
import { ENVIRONMENT_TAGS, SERVICE_TAGS } from "../../constants/tags.js";

type StringGenerator = () => string;

interface ResourceGeneratorOptions {
    tfg: TerraformGenerator;
    environment?: string;
    service?: string;
}

/**
 * Wraps a generator function to ensure the values it returns are not reused within the program runtime
 */
const unique = (generator: StringGenerator): StringGenerator => {
    const used = new Set();
    return () => {
        let value = generator();
        while (used.has(value)) {
            value = generator();
        }

        used.add(value);
        return value;
    };
};

const randomMemorableSlug = unique(() =>
    snakeSlugify(
        `${faker.word.adjective()}_${faker.color.human()}_${faker.animal.type()}`
    )
);

const randomItem = <T>(values: T[]): T => faker.helpers.arrayElement(values);

const randomId = unique(() => faker.internet.mac({ separator: "" }));

const randomEnvironmentTag = () => randomItem(ENVIRONMENT_TAGS);

const randomServiceTag = () => randomItem(SERVICE_TAGS);

export type { StringGenerator, ResourceGeneratorOptions };
export {
    randomId,
    randomItem,
    randomMemorableSlug,
    randomEnvironmentTag,
    randomServiceTag,
    unique,
};
