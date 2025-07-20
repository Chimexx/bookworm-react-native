import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useBooks = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { request } = useApi();

  const loadBooks = useCallback(
    async ({ pageToLoad = 1, isRefresh = false } = {}) => {
      if (loading) return;

      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }

      try {
        const response = await request(
          `/books?page=${pageToLoad}&limit=2`,
          "GET"
        );

        if (response?.books) {
          setBooks((prevBooks) =>
            isRefresh ? response.books : [...prevBooks, ...response.books]
          );

          setHasMore(pageToLoad < response.totalPages);
          if (!isRefresh) setPage(pageToLoad);
        }
      } catch (err: any) {
        console.error("Error loading books:", err?.message || err);
        throw(err.message || err);
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    }, [])

  const refreshBooks = () => {
    setLoading(false);
    setRefreshing(false)

    loadBooks({ pageToLoad: 1, isRefresh: true });
  }

  const fetchNextPage = () => {
    if (hasMore && !loading && !refreshing) {
      loadBooks({ pageToLoad: page + 1 });
    }
  };

  return { books, refreshing, loading, hasMore, refreshBooks, fetchNextPage, loadBooks };
};
