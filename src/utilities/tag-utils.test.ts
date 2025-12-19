import { describe, expect, it, vi } from "vitest";
import { parseTags, stringifyTags } from "./tag-utils.js";

describe("tag-utils", () => {
    describe("parseTags", () => {
        it("trims trailing space on entire string", () => {
            const input = "  foo,bar  ";

            const result = parseTags(input);

            expect(result).toStrictEqual({
                foo: expect.any(String),
                bar: expect.any(String),
            });
        });

        it("trims trailing space between commas", () => {
            const input = "foo , bar";

            const result = parseTags(input);

            expect(result).toStrictEqual({
                foo: expect.any(String),
                bar: expect.any(String),
            });
        });

        it("uses string after color for key value", () => {
            const input = "foo:bar";

            const result = parseTags(input);

            expect(result).toStrictEqual({ foo: "bar" });
        });

        describe("when key appears multiple times", () => {
            it("logs a warning", () => {
                const consoleWarnSpy = vi
                    .spyOn(console, "warn")
                    .mockReturnValue();
                const input = "foo,foo";

                parseTags(input);

                expect(consoleWarnSpy).toHaveBeenCalledOnce();
            });

            it("uses last provided value", () => {
                const input = "foo:bar,foo:buzz";

                const result = parseTags(input);

                expect(result).toStrictEqual({ foo: "buzz" });
            });
        });
    });

    describe("stringifyTags", () => {
        it("returns stringified version of keys and values", () => {
            const tags = { Environment: "dev", service: "web-app" };

            const result = stringifyTags(tags);

            expect(result).toBe("Environment:dev,service:web-app");
        });
    });
});
