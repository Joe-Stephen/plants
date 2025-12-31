import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

interface UsePaginationParamsOptions {
  defaultPage?: number;
  defaultLimit?: number;
}

export const usePaginationParams = (
  options: UsePaginationParamsOptions = {},
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || options.defaultPage || 1;
  const limit = Number(searchParams.get('limit')) || options.defaultLimit || 10;

  const setPage = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('limit', newLimit.toString());
      newParams.set('page', '1'); // Reset to page 1 on limit change
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams],
  );

  return {
    page,
    limit,
    setPage,
    setLimit,
    searchParams, // Expose for other filters if needed
    setSearchParams,
  };
};
