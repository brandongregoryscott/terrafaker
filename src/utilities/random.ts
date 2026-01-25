import { faker } from "@faker-js/faker";
import { range } from "lodash-es";
import { ENVIRONMENT_TAGS, SERVICE_TAGS, TAG_KEYS } from "../constants/tags.js";
import { CloudProviders } from "../enums/cloud-providers.js";
import { StringUtils } from "./string-utils.js";

type StringGenerator = () => string;

const MAX_UNIQUE_GENERATOR_ATTEMPTS = 50;

/**
 * Wraps a generator function to ensure the values it returns are not reused within the program runtime
 */

let globalCache = new Map<string, Set<string>>();

interface MemorySizeOptions extends Required<IntegerOptions> {
    step: number;
}

interface IntegerOptions {
    max?: number;
    min?: number;
}

class Random {
    static awsAmi() {
        return this.unique("awsAmi", () => `ami-${this.id()}`);
    }

    static awsBucket() {
        return this.unique("awsBucket", () =>
            `${this.snakeSlug()}-${this.id()}`.toLowerCase().slice(0, 63)
        );
    }

    static awsRole() {
        return this.unique(
            "awsRole",
            () => `arn:aws:iam::${this.integerId()}:role/${this.snakeSlug()}`
        );
    }

    /**
     * Returns true/false depending on the provided probability (0 to 1)
     */
    static chance(probability: number): boolean {
        return Math.random() < probability;
    }

    static cloudProvider() {
        return this.item(Object.values(CloudProviders));
    }

    static environmentTag() {
        return this.item(ENVIRONMENT_TAGS);
    }

    static id() {
        return this.unique("id", () => faker.internet.mac({ separator: "" }));
    }

    static integer(options: IntegerOptions): number {
        let { max = 100, min = 0 } = options;
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static integerId(length = 12) {
        return this.unique("integerId", () =>
            range(0, length)
                .map(() => this.integer({ max: 9, min: 0 }))
                .join("")
        );
    }

    static item<T>(values: T[]): T {
        return faker.helpers.arrayElement(values);
    }

    static items<T>(
        values: T[],
        count?: number | Required<IntegerOptions>
    ): T[] {
        return faker.helpers.arrayElements(values, count);
    }

    static memorySize(options: MemorySizeOptions): number {
        const { max, min, step } = options;
        const values = range(min, max, step);
        return this.item(values);
    }

    static pascalSlug() {
        return this.unique("pascalSlug", () =>
            StringUtils.snakeToPascal(
                `${faker.word.adjective()}_${faker.color.human()}_${faker.animal.type()}`
            )
        );
    }

    static serviceTag() {
        return this.item(SERVICE_TAGS);
    }

    static snakeSlug() {
        return this.unique("snakeSlug", () =>
            StringUtils.snakeSlugify(
                `${faker.word.adjective()}_${faker.color.human()}_${faker.animal.type()}`
            )
        );
    }

    static tags(
        additionalTags?: Record<string, string>
    ): Record<string, string> {
        const keys = this.items(TAG_KEYS, { max: 4, min: 1 });
        const tags = keys.reduce(
            (accumulated, key) => {
                accumulated[key] = this.snakeSlug();
                return accumulated;
            },
            {} as Record<string, string>
        );

        return { ...tags, ...additionalTags };
    }

    static unique(key: string, generator: StringGenerator): string {
        const used = globalCache.get(key) ?? new Set();

        let value = generator();
        let attempts = 0;

        while (used.has(value) && attempts < MAX_UNIQUE_GENERATOR_ATTEMPTS) {
            attempts++;
            value = generator();
        }

        if (used.has(value)) {
            value = `${value}${Random.id()}`;
        }

        used.add(value);
        globalCache.set(key, used);
        return value;
    }
}

export { Random };
