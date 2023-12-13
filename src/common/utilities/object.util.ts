/**
 * Construct a new object with specified keys from input object
 *
 * @source https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
 */
export const pick = <T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (obj, key) => {
      // biome-ignore lint/suspicious/noPrototypeBuiltins: Likely good enough for code 🤷
      if (object?.hasOwnProperty(key)) {
        obj[key] = object[key];
      }
      return obj;
    },
    {} as Pick<T, K>,
  );
};

/** Construct a new object with specified keys **omitted** from input object */
export const omit = <T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> => {
  return keys.reduce(
    (obj, key) => {
      delete obj[key];
      return obj;
    },
    { ...object },
  );
};
