import type { PaginatedResult, Pagination, PaginationInput, PaginationQuery } from "#common/types";

/** Default pagination page size */
export const PAGINATION_PAGE_SIZE_DEFAULT = 10;
/** Maximum pagination page size */
export const PAGINATION_PAGE_SIZE_MAX = 100;

/** Parse pagination values from query string */
export const getPaginationFromQuery = (query: PaginationQuery): PaginationInput => {
  let size = query.size ? parseInt(`${query.size}`, 10) : PAGINATION_PAGE_SIZE_DEFAULT;
  if (Number.isNaN(size) || size <= 0) {
    size = PAGINATION_PAGE_SIZE_DEFAULT;
  }

  if (size > PAGINATION_PAGE_SIZE_MAX) size = PAGINATION_PAGE_SIZE_MAX;

  let page = query.page ? parseInt(`${query.page}`) : 1;
  if (Number.isNaN(page) || page <= 0) {
    page = 1;
  }

  return {
    page,
    size,
  };
};

/**
 * Paginate a list and add pagination meta
 *
 * @param   allItems Unpaginated items
 * @param   input    Pagination basic info
 * @returns Paginated data and statistics
 * @example
 * const paginationInput = { page: 2, size: 10 };
 * return paginate([...], paginationInput});
 */
export const paginate = <T>(
  allItems: T[],
  input?: Partial<PaginationInput>,
): PaginatedResult<T> => {
  const currentPage = input?.page ?? 1;
  const pageSize = input?.size ?? PAGINATION_PAGE_SIZE_DEFAULT;
  const itemCount = allItems.length;
  const itemsPerPage = Math.min(Math.max(pageSize, 1), PAGINATION_PAGE_SIZE_MAX);
  const pageCount = itemCount > 0 ? Math.ceil(itemCount / itemsPerPage) : 0;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedItems = allItems.filter((_item, idx) => idx >= startIdx && idx < endIdx);

  const pagination: Pagination = {
    page: currentPage,
    size: itemsPerPage,
    totalItems: itemCount,
    totalPages: pageCount,
  };

  return {
    data: paginatedItems,
    pagination,
  };
};
