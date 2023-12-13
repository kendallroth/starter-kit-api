/**
 * Create a list with callback to customize each item
 *
 * @param amount     Number of items to create
 * @param createItem Callback to create individual list items
 */
export const createList = <T>(amount: number, createItem: (idx: number) => T): T[] => {
  return new Array(amount).fill(0).map((_, idx) => createItem(idx));
};

/** Convert a `Map` to an `Array` */
export const mapToArray = <T>(map: Map<string, T>): T[] => {
  return Array.from(map.values());
};

/** Get a random item from a list */
export const randomFromList = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)] as T;
};

/** Get a random integer within a range */
export const randomFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};
