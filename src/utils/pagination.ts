export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export const getPagination = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10)); // Max limit 100
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const getPagingData = <T>(
  rows: T[],
  count: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(count / limit);
  return {
    data: rows,
    metadata: {
      total: count,
      page,
      limit,
      totalPages,
    },
  };
};
