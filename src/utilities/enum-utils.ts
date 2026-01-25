import type { ObjectValues } from "../types/object-values.js";

class EnumUtils {
    static isEnumValue<T extends Record<string, string>>(
        obj: T,
        value: string
    ): value is ObjectValues<T> {
        const values = Object.values(obj);
        return values.includes(value);
    }

    static parseValue<T extends Record<string, string>>(
        obj: T,
        value: string
    ): ObjectValues<T> | undefined {
        if (!this.isEnumValue(obj, value)) {
            return undefined;
        }

        return value;
    }
}

export { EnumUtils };
