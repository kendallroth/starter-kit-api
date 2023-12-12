export const createList = <T>(amount: number, createItem: (idx: number) => T): T[] => {
  return new Array(amount).fill(0).map((_, idx) => createItem(idx));
};

/** Convert a Map to an Array */
export const mapToArray = <T>(map: Map<string, T>): T[] => {
  return Array.from(map.values());
};

export const randomFromList = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)] as T;
};

export const randomFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};
