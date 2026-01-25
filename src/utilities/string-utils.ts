import { faker } from "@faker-js/faker";
import { ux } from "@oclif/core";
import { upperFirst } from "lodash-es";
import { extname } from "node:path";
import { IacTypes, type IacType } from "../enums/iac-types.js";

interface FormatFileNameOptions {
    fileName?: string;
    iacType?: IacType;
}

class StringUtils {
    static formatFileName(options: FormatFileNameOptions): string {
        const { iacType } = options;

        const fileName = dropExtension(
            options.fileName ?? getDefaultFileName(iacType)
        );
        const extension = getFileExtension(iacType);
        return `${fileName}${extension}`;
    }

    static formatInstructions(...instructions: string[]): string {
        return instructions
            .map((instruction) => `  • ${instruction}`)
            .join("\n");
    }

    static slugify(value: string): string {
        return faker.helpers.slugify(value).toLowerCase();
    }

    static snakeSlugify(value: string): string {
        return StringUtils.slugify(value).replaceAll("-", "_");
    }

    static snakeToPascal(snakeSlug: string): string {
        return snakeSlug.split("_").map(upperFirst).join("");
    }

    static success(message: string): string {
        return `${ux.colorize("green", "✓")} ${message}`;
    }

    static warn(message: string): string {
        return `${ux.colorize("yellow", "⚠")} ${message}`;
    }
}

function dropExtension(fileName: string): string {
    const extension = extname(fileName);
    return fileName.replaceAll(extension, "");
}

function getDefaultFileName(iacType: IacType | undefined): string {
    switch (iacType) {
        case IacTypes.CloudFormation:
            return "template";
        case IacTypes.Terraform:
        default:
            return "main";
    }
}

function getFileExtension(iacType: IacType | undefined): string {
    switch (iacType) {
        case IacTypes.CloudFormation:
            return ".json";
        case IacTypes.Terraform:
        default:
            return ".tf";
    }
}

export { StringUtils };
