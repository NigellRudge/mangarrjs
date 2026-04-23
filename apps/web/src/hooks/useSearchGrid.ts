import { useRouter } from "next/router";
import useSWR from "swr";
import { backendClient } from "@/http/api-client";
import { useState } from "react";
import { hasItems } from "@mangarr/shared";

const useSearchGrid = () => {
  const { query, replace, pathname } = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const searchQuery = (query?.query || "") as string;
  const page = parseInt((query?.page || "1") as string);

  const cacheKey =
    searchQuery.length >= 3 && canLoadMore
      ? `search-${searchQuery}-${page}`
      : null;
  const { isValidating: isLoading } = useSWR(cacheKey, async () => {
    const response = await backendClient.search(searchQuery, page);
    if (Boolean(response) && hasItems(response)) {
      setResults((prev) => {
        if (page === 1) return [...response];
        return [...prev, ...response];
      });
      setCanLoadMore(true);
    } else {
      setCanLoadMore(false);
    }
  });

  const fetchMore = async () => {
    if (!canLoadMore) return;
    await replace({
      pathname,
      query: {
        ...query,
        page: page + 1,
      },
    });
  };

  return {
    results,
    isLoading,
    fetchMore,
  };
};

export default useSearchGrid;
