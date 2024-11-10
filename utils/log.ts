// @ts-expect-error, js lib
import treeify from 'object-treeify';

export const prettyPrintObjectToString = (object: Record<string, unknown>, prefix = ''): string =>
  `\n${prefix}:\n\n${treeify(object)}`;

export const logPrettyPrintObject = (...args: Parameters<typeof prettyPrintObjectToString>): void =>
  console.log(prettyPrintObjectToString(...args));
