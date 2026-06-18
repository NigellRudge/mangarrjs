import { useContext, useMemo } from "react";
import { DiscoverContext } from "@/providers/DiscoverProvider";
import { titleCase } from "@mangarr/shared/string-utils";
import { removeEmptyKeys } from "@mangarr/shared";

const mapFacetOptions = (items?: string[]) => {
  if (!items) return [];
  return items.map((item) => ({
    label: titleCase(item),
    value: item,
  }));
};

const useDiscoverManga = () => {
  const {
    facetOptions,
    activeFilters,
    mangas,
    isLoading,
    type,
    isFiltersFlyoutOpen,
    setIsFiltersFlyoutOpen,
    updateActiveFiltersForKey,
    clearFilters,
    fetchMore,
  } = useContext(DiscoverContext);

  const genres = useMemo(
    () => mapFacetOptions(facetOptions?.genres),
    [facetOptions],
  );

  const mediaTypes = useMemo(
    () => mapFacetOptions(facetOptions?.mediaTypes),
    [facetOptions],
  );

  const statusTypes = useMemo(
    () => mapFacetOptions(facetOptions?.statusTypes),
    [facetOptions],
  );
  const sources = useMemo(
    () => mapFacetOptions(facetOptions?.sources),
    [facetOptions],
  );

  const numberOfActiveFilters = useMemo(() => {
    if (!activeFilters) return 0;
    const actualFilters =
      removeEmptyKeys({
        ...activeFilters,
        page: null,
        pageSize: null,
        sort: null,
      }) || {};
    return Object.keys(actualFilters).length;
  }, [activeFilters]);

  return {
    updateActiveFiltersForKey,
    activeFilters,
    facetOptions,
    mangas,
    isLoading,
    type,
    isFiltersFlyoutOpen,
    genres,
    mediaTypes,
    statusTypes,
    sources,
    numberOfActiveFilters,
    clearFilters,
    fetchMore,
    openFilterFlyOut: () => setIsFiltersFlyoutOpen(true),
    closeFilterFlyOut: () => setIsFiltersFlyoutOpen(false),
  };
};

export default useDiscoverManga;
