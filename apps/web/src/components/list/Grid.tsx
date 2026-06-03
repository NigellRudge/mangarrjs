import { ChapterResponse, hasItems, MangaResponse } from "@mangarr/shared";
import useBrowserBreakpoints from "@/hooks/useBrowserBreakpoints";
import { useInView } from "react-hook-inview";
import { useEffect } from "react";
import MediaCard from "@/components/cards/MediaCard";

const PlaceHolderItem = () => (
  <div className="w-full h-full">
    <div className="skeleton h-full aspect-[4/6]"></div>
  </div>
);

const Grid = ({
  items,
  isLoading = false,
  type = "manga",
  onEndReached,
}: {
  items: MangaResponse[] | ChapterResponse[] | undefined;
  isLoading?: boolean;
  type: "manga" | "chapter";
  onEndReached?: () => Promise<void> | null;
}) => {
  const { isMobileBreakpoint, isDesktopBreakpoint, isExtraLargeBreakpoint } =
    useBrowserBreakpoints();
  const eagerLoadingCutOff =
    (isMobileBreakpoint && 4) ||
    (isDesktopBreakpoint && 10) ||
    (isExtraLargeBreakpoint && 12) ||
    4;
  const [ref, isInView] = useInView({ threshold: 1 });
  const isLoadingMore = hasItems(items) && isLoading;

  useEffect(() => {
    if (!isLoading && hasItems(items) && isInView && Boolean(onEndReached)) {
      // @ts-expect-error
      onEndReached();
    }
  }, [isInView, isLoading, items, onEndReached]);

  if (!hasItems(items) && !isLoading) {
    return null;
  }

  const renderSkeletons = () =>
    Array(50)
      .fill(0)
      .map((_, i) => <PlaceHolderItem key={i} />);

  if (isLoading && !hasItems(items)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-2 overflow-y-auto p-1">
        {renderSkeletons()}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3 no-scrollbar relative">
      {hasItems(items) &&
        items?.map((item, index) => (
          <li key={`${index}-${item.id}`}>
            <div className="w-full">
              <MediaCard
                canExpand
                loadEager={index <= eagerLoadingCutOff}
                type={type}
                item={item}
              />
            </div>
          </li>
        ))}
      {isLoadingMore && renderSkeletons()}
      <li ref={ref} className="opacity-0"></li>
    </ul>
  );
};

export default Grid;
