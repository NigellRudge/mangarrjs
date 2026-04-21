import { useRouter } from "next/router";
import useDebouncedState from "@/hooks/useDebouncedState";
import { ChangeEvent, useEffect, useState } from "react";
import type { UrlObject } from "url";

const isSearchPage = (pathname: string) => pathname.startsWith("/search");

const useSearchInput = () => {
  const router = useRouter();
  const [inputValue, setInputValue, debouncedValue] = useDebouncedState<string>(
    (router.query.query as string) ?? "",
  );
  const [isFocused, setIsFocused] = useState(false);
  const [lastRoute, setLastRoute] = useState<UrlObject | string | null>(null);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const clearQuery = () => {
    setInputValue("");
    setIsFocused(false);
  };

  useEffect(() => {
    if (debouncedValue !== "" && isFocused) {
      if (isSearchPage(router.pathname)) {
        router.replace({
          pathname: router.pathname,
          query: {
            ...router.query,
            query: debouncedValue,
          },
        });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastRoute(router.asPath);
        router
          .push({
            pathname: "/search",
            query: { query: debouncedValue },
          })
          .then(() => window.scrollTo(0, 0));
      }
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (inputValue === "" && isSearchPage(router.pathname) && !isFocused) {
      if (lastRoute) {
        router.push(lastRoute).then(() => window.scrollTo(0, 0));
      } else {
        router.replace("/").then(() => window.scrollTo(0, 0));
      }
    }
  }, [isFocused, inputValue]);

  useEffect(() => {
    if (router.query.query !== debouncedValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(
        router.query.query
          ? decodeURIComponent(router.query.query as string)
          : "",
      );

      if (!isSearchPage(router.pathname) && !router.query.query) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsFocused(false);
      }
    }

    if (isSearchPage(router.pathname)) {
      setIsFocused(true);
    }
  }, [router, setInputValue]);

  return {
    isFocused,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    showClearButton: inputValue?.length >= 3,
    query: debouncedValue,
    inputValue,
    handleSearch,
    clearQuery,
  };
};

export default useSearchInput;
