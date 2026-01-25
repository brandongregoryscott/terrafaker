import { describe, expect, it } from "vitest";
import { Random } from "./random.js";

describe("unique", () => {
    describe("when all potential values have been exhausted", () => {
        it("returns existing value with unique id appended", () => {
            const randomValue = () =>
                Random.unique(
                    "returns existing value with unique id appended",
                    () => "foo"
                );

            randomValue();
            randomValue();
            const thirdResult = randomValue();

            expect(thirdResult.startsWith("foo")).toBe(true);
            expect(thirdResult.length).toBeGreaterThan(3);
        });
    });
});
