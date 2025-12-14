type ObjectValues<T extends Record<string, unknown>> = T[keyof T];

export type { ObjectValues };
