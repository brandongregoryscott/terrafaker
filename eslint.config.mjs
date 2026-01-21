import { includeIgnoreFile } from "@eslint/compat";
import stylistic from "@stylistic/eslint-plugin";
import collation from "eslint-plugin-collation";
import perfectionist from "eslint-plugin-perfectionist";
import vitest from "eslint-plugin-vitest";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "typescript-eslint";

const gitignorePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".gitignore"
);

const config = defineConfig(
    { files: ["src/**/*.ts"] },
    {
        rules: {
            curly: "error",
            "no-var": "error",
        },
    },
    {
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/padding-line-between-statements": [
                "error",
                {
                    blankLine: "always",
                    next: "export",
                    prev: "*",
                },
                {
                    blankLine: "never",
                    next: "export",
                    prev: "export",
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: "import",
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: "interface",
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: "type",
                },
                {
                    blankLine: "never",
                    next: "import",
                    prev: "import",
                },
            ],
        },
    },
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint.plugin,
        },
        rules: {
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
        },
    },
    {
        plugins: {
            collation,
        },
        rules: {
            "collation/group-exports": "error",
            "collation/no-default-export": "error",
            "collation/no-inline-export": "error",
            "collation/sort-exports": "error",
        },
    },
    {
        plugins: {
            perfectionist,
        },
        rules: {
            "perfectionist/sort-classes": [
                "error",
                {
                    fallbackSort: { type: "unsorted" },
                    groups: [
                        "readonly-property",
                        "property",
                        "private-property",
                        "constructor",
                        "abstract-method",
                        "static-method",
                        ["get-method", "set-method"],
                        "method",
                        "private-static-method",
                        "private-method",
                    ],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    newlinesInside: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                },
            ],
            "perfectionist/sort-exports": "error",
            "perfectionist/sort-imports": ["error", { newlinesBetween: 0 }],
            "perfectionist/sort-interfaces": "error",
            "perfectionist/sort-intersection-types": "error",
            "perfectionist/sort-object-types": "error",
            "perfectionist/sort-objects": "error",
            "perfectionist/sort-union-types": "error",
        },
    },
    {
        files: ["**/*.test.ts"],
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: { vitest },
        rules: {
            "vitest/no-focused-tests": "error",
            "vitest/no-identical-title": "error",
            "vitest/no-import-node-test": "error",
            "vitest/prefer-each": "error",
            "vitest/prefer-lowercase-title": [
                "error",
                { ignore: ["describe"] },
            ],
            "vitest/require-top-level-describe": "error",
            "vitest/valid-describe-callback": "error",
            "vitest/valid-expect": "error",
            "vitest/valid-title": "error",
        },
    },
    {
        ignores: ["**/*.test.ts", "eslint.config.mjs", "bin"],
    },
    [includeIgnoreFile(gitignorePath)]
);

export default config;
