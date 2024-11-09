// @ts-expect-error, js lib
import treeify from 'object-treeify';

const divider = '\n---------------------------------------------\n';

export const prettyPrintObjectToString = (object: Record<string, unknown>, prefix = ''): string =>
  `${prefix}:\n\n${treeify(object)}`;

export const logPrettyPrintObject = (...args: Parameters<typeof prettyPrintObjectToString>): void =>
  console.log(prettyPrintObjectToString(...args));

export const logPrettyPrintConfig = (...args: Parameters<typeof prettyPrintObjectToString>): void =>
  console.log(`${divider}${prettyPrintObjectToString(...args)}${divider}`);
