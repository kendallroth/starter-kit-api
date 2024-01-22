import { faker } from "@faker-js/faker";

/**
 * Randomized seed for generating deterministically random FakerJS data
 *
 * NOTE: Changing seed will change the generated data (unexpected)!
 */
export const RANDOM_DATA_SEED = 1;

/** Get a random item from a list */
export const randomFromList = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)] as T;
};

/**
 * Generate a random list (configurable size)
 *
 * @param size     List size (length or min/max)
 * @param callback Callback for creating individual list elements
 */
export const generateRandomList = <T>(
  size: number | { min: number; max: number },
  callback: (index: number) => T,
): T[] => {
  const length = typeof size === "number" ? size : randomFromRange(size.min, size.max);
  return [...Array(length).keys()].map((idx) => callback(idx));
};

/** Get a random integer within a range */
export const randomFromRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * max) + min;
};

/**
 * Get a random boolean
 *
 * @param probability Probability of `true` value (0-1)
 */
export const randomBool = (probability?: number): boolean => {
  return faker.datatype.boolean(probability);
};
