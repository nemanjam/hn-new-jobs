export type ValueUnion<T extends Record<string, unknown>> = T[keyof T];
