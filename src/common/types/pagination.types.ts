/** Service function filter operators (similar to pagination) */
export interface PaginatedFilterQuery extends Partial<PaginationQuery> {
  /** Search text */
  search?: string;
}

/** Page-based pagination metadata */
export interface Pagination {
  /** Current pagination page */
  page: number;
  /** Page size */
  size: number;
  /** Total number of available items (ie. not just item count of current page!) */
  totalItems: number;
  /** Total number of available pages */
  totalPages: number;
}

/** Pagination request params */
export interface PaginationQuery {
  /**
   * Requested page size
   * @isInt
   * @minimum 1
   */
  size?: number;
  /**
   * Requested page number
   * @isInt
   * @minimum 1
   */
  page?: number;
  /**
   * Requested sorting order
   *
   * @example "starredAt,-createdAt"
   */
  sort?: string;
}

/** Pagination request params */
export interface PaginationInput {
  /** Requested page size */
  size: number;
  /** Requested page number */
  page: number;
}

/**
 * Paginated data with pagination info/links
 *
 * NOTE: Since class uses generics for tying 'data', multiple properties must be replicated for
 *         Swagger documentation (since plugin does not pick up properly with generics).
 */
export interface PaginatedResult<T> {
  data: T[];
  /** Result pagination information */
  pagination: Pagination;
}
