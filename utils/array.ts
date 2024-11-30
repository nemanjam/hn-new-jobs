export const getUniqueArray = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const getDuplicatedArrayItems = <T>(arr: T[]): T[] => {
  const counts = new Map<T, number>();
  const doubledItems: T[] = [];

  // Count occurrences of each item
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  // Collect items that occur more than once
  for (const [item, count] of counts) {
    if (count > 1) {
      doubledItems.push(item);
    }
  }

  return doubledItems;
};
