import { Random } from "./random.js";
import { StringUtils } from "./string-utils.js";

class TagUtils {
    static parse(tagString: string): Record<string, string> {
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

                accumulated[tag] = value ?? Random.snakeSlug();
                return accumulated;
            },
            {} as Record<string, string>
        );

        return tags;
    }

    static stringify(tags: Record<string, string>): string {
        return Object.entries(tags)
            .map(([key, value]) => `${key}:${value}`)
            .join(",");
    }
}

export { TagUtils };
