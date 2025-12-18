import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "typescript-eslint";
import collation from "eslint-plugin-collation";
import vitest from "eslint-plugin-vitest";

const gitignorePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".gitignore"
);

const config = defineConfig(
    [includeIgnoreFile(gitignorePath)],
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        files: ["src/**/*.ts"],
        ignores: ["**/*.test.ts"],
        plugins: {
            "@stylistic": stylistic,
            "@typescript-eslint": typescriptEslint.plugin,
            collation,
        },
        rules: {
            curly: "error",
            "no-var": "error",
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
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "collation/group-exports": "error",
            "collation/no-default-export": "error",
            "collation/no-inline-export": "error",
            "collation/sort-exports": "error",
        },
    },
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        files: ["**/*.test.ts"],
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
    }
);

export default config;
