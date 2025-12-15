import { describe, expect, it } from "vitest";
import { unique } from "./generator-utils.js";

describe("unique", () => {
    it("does not return duplicate values", () => {
        const randomValue = unique(() => (Math.random() < 0.5 ? "foo" : "bar"));

        const firstResult = randomValue();
        const secondResult = randomValue();

        expect(firstResult).not.toBe(secondResult);
    });

    describe("when all potential values have been exhausted", () => {
        it("returns existing value with unique id appended", () => {
            const randomValue = unique(() =>
                Math.random() < 0.5 ? "foo" : "bar"
            );

            randomValue();
            randomValue();
            const thirdResult = randomValue();

            expect(
                thirdResult.startsWith("foo") || thirdResult.startsWith("bar")
            ).toBe(true);
            expect(thirdResult.length).toBeGreaterThan(3);
        });
    });
});
