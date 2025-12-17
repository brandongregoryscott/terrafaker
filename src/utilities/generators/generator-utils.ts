import { faker } from "@faker-js/faker";
import { snakeSlugify } from "../string-utils.js";
import {
    ENVIRONMENT_TAGS,
    SERVICE_TAGS,
    TAG_KEYS,
} from "../../constants/tags.js";
import { Providers } from "../../enums/providers.js";
import { range } from "lodash-es";

type StringGenerator = () => string;

const MAX_UNIQUE_GENERATOR_ATTEMPTS = 50;

/**
 * Wraps a generator function to ensure the values it returns are not reused within the program runtime
 */
function unique(generator: StringGenerator): StringGenerator {
    const used = new Set();
    return () => {
        let value = generator();
        let attempts = 0;

        while (used.has(value) && attempts < MAX_UNIQUE_GENERATOR_ATTEMPTS) {
            attempts++;
            value = generator();
        }

        if (used.has(value)) {
            value = `${value}${randomId()}`;
        }

        used.add(value);
        return value;
    };
}

const randomMemorableSlug = unique(() =>
    snakeSlugify(
        `${faker.word.adjective()}_${faker.color.human()}_${faker.animal.type()}`
    )
);

const randomItem = <T>(values: T[]): T => faker.helpers.arrayElement(values);

const randomItems = <T>(
    values: T[],
    count?: number | Required<RandomIntOptions>
): T[] => faker.helpers.arrayElements(values, count);

const randomProvider = () => randomItem(Object.values(Providers));

const randomId = unique(() => faker.internet.mac({ separator: "" }));

const randomEnvironmentTag = () => randomItem(ENVIRONMENT_TAGS);

const randomServiceTag = () => randomItem(SERVICE_TAGS);

const randomTags = (
    additionalTags?: Record<string, string>
): Record<string, string> => {
    const keys = randomItems(TAG_KEYS, { min: 1, max: 4 });
    const tags = keys.reduce(
        (accumulated, key) => {
            accumulated[key] = randomMemorableSlug();
            return accumulated;
        },
        {} as Record<string, string>
    );

    return { ...tags, ...additionalTags };
};

interface RandomMemorySizeOptions extends Required<RandomIntOptions> {
    step: number;
}

const randomMemorySize = (options: RandomMemorySizeOptions): number => {
    const { min, max, step } = options;
    const values = range(min, max, step);
    return randomItem(values);
};

interface RandomIntOptions {
    min?: number;
    max?: number;
}

const randomInt = (options: RandomIntOptions): number => {
    let { min = 0, max = 100 } = options;
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns true/false depending on the provided probability (0 to 1)
 */
const maybe = (probability: number): boolean => Math.random() < probability;

export {
    maybe,
    randomEnvironmentTag,
    randomId,
    randomInt,
    randomItem,
    randomItems,
    randomMemorableSlug,
    randomMemorySize,
    randomProvider,
    randomServiceTag,
    randomTags,
    unique,
};
