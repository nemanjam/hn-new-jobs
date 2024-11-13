/** Get value type union from const object. */
export type ValueUnion<T extends Record<string, unknown>> = T[keyof T];
