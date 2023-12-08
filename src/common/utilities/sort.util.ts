import type { ISortByObjectSorter } from "fast-sort";

/**
 * Get list of sorting operations (from query params)
 *
 * NOTE: Uses `-` for inverted sort.
 *
 * @param sort        Sort list or comma-separted string
 * @param validKeys   List of valid sort keys
 * @param defaultSort Default sort key
 */
export const getSortList = <T>(
  sort: string | string[] | undefined,
  validKeys: string[],
  defaultSort?: string | string[],
): ISortByObjectSorter<T>[] => {
  if (!validKeys.length) return [];

  const sortRaw = sort ?? defaultSort;
  const sortListRaw: string[] = Array.isArray(sortRaw) ? sortRaw : sortRaw?.split(",") ?? [];
  const sortList = sortListRaw.filter((s) => validKeys.includes(s.replace("-", "")));
  if (!sortList.length) return [];

  const sortConfig = sortList.reduce((accum: ISortByObjectSorter<T>[], key) => {
    const direction = key.startsWith("-") ? "desc" : "asc";
    // @ts-expect-error
    const sort: ISortByObjectSorter<T> = {
      [direction]: key.replace("-", ""),
    };
    return [...accum, sort];
  }, []);

  return sortConfig;
};
