import { faker } from "@faker-js/faker";
import { ux } from "@oclif/core";

class StringUtils {
    static formatInstructions(...instructions: string[]): string {
        return instructions
            .map((instruction) => `  • ${instruction}`)
            .join("\n");
    }

    static formatTfFileName(fileName: string): string {
        return fileName.endsWith(".tf") ? fileName : `${fileName}.tf`;
    }

    static slugify(value: string): string {
        return faker.helpers.slugify(value).toLowerCase();
    }

    static snakeSlugify(value: string): string {
        return StringUtils.slugify(value).replaceAll("-", "_");
    }

    static success(message: string): string {
        return `${ux.colorize("green", "✓")} ${message}`;
    }

    static warn(message: string): string {
        return `${ux.colorize("yellow", "⚠")} ${message}`;
    }
}

export { StringUtils };
