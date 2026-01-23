import { randomMemorableSlug } from "./generators/generator-utils.js";
import { StringUtils } from "./string-utils.js";

const parseTags = (tagString: string): Record<string, string> => {
    const csvTags = tagString.split(",").map((value) => value.trim());
    const tags = csvTags.reduce(
        (accumulated, csvTag) => {
            const [tag, value] = csvTag.split(":");

            if (tag in accumulated) {
                console.warn(
                    StringUtils.warn(
                        `tag '${tag}' specified more than once, earlier value will be overwritten.`
                    )
                );
            }

            accumulated[tag] = value ?? randomMemorableSlug();
            return accumulated;
        },
        {} as Record<string, string>
    );

    return tags;
};

const stringifyTags = (tags: Record<string, string>): string =>
    Object.entries(tags)
        .map(([key, value]) => `${key}:${value}`)
        .join(",");

export { parseTags, stringifyTags };
