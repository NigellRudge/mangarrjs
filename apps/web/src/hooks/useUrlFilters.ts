import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { DiscoverFilters, MangaSourceType } from "@mangarr/shared";
import { useEffect, useMemo } from "react";

function getValueFromQuery<T>(
  query: ParsedUrlQuery,
  key: string,
): T | undefined {
  if (!query) return;
  const value = query[key];
  if (!value) return;
  return value as T;
}

const getFiltersFromUrl = (query: ParsedUrlQuery): DiscoverFilters => {
  return {
    genres: getValueFromQuery<string[]>(query, "genres"),
    sources: getValueFromQuery<MangaSourceType[]>(query, "sources"),
    statusTypes: getValueFromQuery<string[]>(query, "statusTypes"),
    mediaTypes: getValueFromQuery<string[]>(query, "mediaTypes"),
    page: parseInt(getValueFromQuery<string>(query, "page") || "1"),
    pageSize: parseInt(getValueFromQuery<string>(query, "pageSize") || "25"),
    sort: "name-asc",
  };
};

const useUrlFilters = () => {
  const router = useRouter();

  const activeFilters = useMemo(
    () => getFiltersFromUrl(router.query),
    [router.query],
  );

  useEffect(() => {
    if (!router.query?.page) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 1,
        },
      });
    }
  }, [router.asPath]);

  const updateActiveFiltersForKey = <K extends keyof DiscoverFilters>(
    key: K,
    value: DiscoverFilters[K],
  ) => {
    if (value === undefined) return;
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 1,
        [key]: value,
      },
    });
  };

  const clearFilters = () => {
    router.replace({
      pathname: router.pathname,
      query: null,
    });
  };

  const loadNextPage = () => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: (activeFilters.page || 1) + 1,
      },
    });
  };

  return {
    activeFilters,
    updateActiveFiltersForKey,
    loadNextPage,
    clearFilters,
  };
};

export default useUrlFilters;
