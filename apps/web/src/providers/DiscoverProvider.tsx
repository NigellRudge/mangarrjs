import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  DiscoverFilters,
  hasItems,
  MangaResponse,
  MangaSourceType,
} from "@mangarr/shared";
import useSWR from "swr";
import { backendClient } from "@/http/api-client";
import useUrlFilters from "@/hooks/useUrlFilters";

type DiscoverStateType = {
  isFiltersFlyoutOpen?: boolean;
  setIsFiltersFlyoutOpen: Dispatch<SetStateAction<boolean>>;
  mangas?: MangaResponse[];
  facetOptions?: {
    genres: string[];
    mediaTypes: string[];
    statusTypes: string[];
    sources: MangaSourceType[];
  };
  activeFilters: DiscoverFilters;
  isLoading?: boolean;
  type: "manga" | "chapter";
  fetchMore?: () => Promise<void>;
  clearFilters?: () => void;
  updateActiveFiltersForKey: <K extends keyof DiscoverFilters>(
    key: K,
    value: DiscoverFilters[K],
  ) => void;
};

export const DiscoverContext = createContext<DiscoverStateType>({
  isFiltersFlyoutOpen: false,
  setIsFiltersFlyoutOpen: (data?: any) => {},
  mangas: undefined,
  facetOptions: undefined,
  activeFilters: {
    genres: [],
    sort: "name-asc",
    pageSize: 25,
    page: 1,
  },
  type: "manga",
  updateActiveFiltersForKey: () => {},
  clearFilters: () => {},
});

const DiscoverProvider = ({ children }: { children: ReactNode }) => {
  const {
    activeFilters,
    updateActiveFiltersForKey,
    clearFilters,
    loadNextPage,
  } = useUrlFilters();
  const [isFiltersFlyoutOpen, setIsFiltersFlyoutOpen] = useState(false);

  const [mangas, setMangas] = useState<any[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const cacheKey = JSON.stringify(activeFilters);

  const { isValidating: isLoadingMangas } = useSWR(cacheKey, async () => {
    const response = await backendClient.discover(activeFilters);
    if (Boolean(response) && hasItems(response)) {
      setMangas((prev) => {
        if (activeFilters.page === 1) return [...response];
        return [...prev, ...response];
      });
      setCanLoadMore(true);
    } else {
      setCanLoadMore(false);
    }
  });

  const { data: facetOptions, isValidating: isLoadingFacets } = useSWR(
    "discover-facets",
    async () => await backendClient.discoverFacets(),
  );

  const fetchMore = async () => {
    if (!canLoadMore) return;
    loadNextPage();
  };

  return (
    <DiscoverContext.Provider
      value={{
        activeFilters,
        mangas,
        isLoading: isLoadingMangas || isLoadingFacets,
        type: "manga",
        fetchMore,
        facetOptions,
        isFiltersFlyoutOpen,
        setIsFiltersFlyoutOpen,
        updateActiveFiltersForKey,
        clearFilters,
      }}
    >
      {children}
    </DiscoverContext.Provider>
  );
};

export default DiscoverProvider;
