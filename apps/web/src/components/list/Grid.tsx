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
  items: MangaResponse[] | ChapterResponse[];
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
    Array(24)
      .fill(0)
      .map((_, i) => <PlaceHolderItem key={i} />);

  if (isLoading && !hasItems(items)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-2 overflow-y-scroll p-1">
        {renderSkeletons()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-2 h-full overflow-y-scroll p-1 no-scrollbar">
      {hasItems(items) &&
        items.map((item, index) => (
          <MediaCard
            canExpand
            loadEager={index <= eagerLoadingCutOff}
            type={type}
            item={item}
            key={`${index}-${item.id}`}
          />
        ))}
      {isLoadingMore && renderSkeletons()}
      <div ref={ref} className="opacity-0"></div>
    </div>
  );
};

export default Grid;
