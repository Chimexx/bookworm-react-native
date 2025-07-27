import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "./useApi";

const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { request } = useApi();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadBooks = useCallback(
    async ({
      pageToLoad = 1,
      isRefresh = false,
      subRoute = "",
    }: {
      pageToLoad?: number;
      isRefresh?: boolean;
      subRoute?: string;
    }) => {
      if (loading || refreshing) return;

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true);
      }

      try {
        const response = await request(
          `/books${subRoute}?page=${pageToLoad}&limit=2`,
          "GET"
        );

        if (!isMounted.current) return;

        if (response?.books) {
          setBooks((prevBooks) =>
            isRefresh ? response.books : [...prevBooks, ...response.books]
          );
          setHasMore(pageToLoad < response.totalPages);
        }
      } catch (error: any) {
        if (isMounted.current) {
          console.error("Error loading books:", error?.message || error);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [request, loading, refreshing]
  );

  return {
    books,
    refreshing,
    loading,
    hasMore,
    loadBooks,
    setBooks,
  };
};

export default useBooks;
