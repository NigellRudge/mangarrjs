import {
  ChapterResponse,
  hasItems,
  joinSafe,
  MangaResponse,
} from "@mangarr/shared";
import Link from "next/link";
import BackendImage from "@/components/BackendImage";
import useBrowserBreakpoints from "@/hooks/useBrowserBreakpoints";
import { useInView } from "react-hook-inview";
import { useEffect } from "react";

const PlaceHolderItem = () => (
  <div className="w-full h-full">
    <div className="skeleton h-full aspect-[4/6]"></div>
  </div>
);

const TypeIndicator = ({ type }: { type: "manga" | "chapter" }) => {
  if (!["manga", "chapter"].includes(type)) return null;
  const backgroundColor = type === "manga" ? "bg-secondary" : "bg-primary";
  const text = type === "manga" ? "Manga" : "Chapter";

  return (
    <div
      className={`text-xs top-3 right-3 absolute z-[5] flex items-center justify-center px-2 py-1 rounded-2xl text-gray-100 ${backgroundColor} group-hover:scale-[1.02] transition-transform ease-in-out duration-200`}
    >
      {text}
    </div>
  );
};

const GridItem = ({
  item,
  type,
  loadEager,
}: {
  item: MangaResponse | ChapterResponse;
  type: "manga" | "chapter";
  loadEager?: boolean;
}) => {
  let titleStyle = "text-md font-extrabold md:text-lg";
  let title = item.title;
  if (item.title?.length > 50) {
    title = item.title?.slice(0, 80) + "....";
    titleStyle = "text-md font-bold";
  }
  const id = type === "manga" ? item.id : (item as ChapterResponse).mangaId;
  const slug = joinSafe([id, item.sourceId], "_");

  return (
    <Link href={`/manga/${slug}`} className="relative">
      <div className="hover:scale-[1.02] border  group bg-base-100 transform-gpu bg-base-10 flex-1 transition-all duration-200 hover:border-gray-300 border-gray-500 overflow-hidden aspect-[4/6] rounded-xl">
        <TypeIndicator type={type} />
        <div className="w-full h-full relative ">
          <BackendImage
            fill
            loading={loadEager ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            src={item?.coverImage}
            alt={item?.coverImage}
            sizes="(min-width: 768px) 20vw,(min-width: 1025px) 15vw, 40vw"
            source={item.sourceId}
          />
        </div>

        <div
          className="absolute inset-0 opacity-0
          flex items-end
          ease-in-out
          transition-all
          group-hover:opacity-100
          translate-y-2
          group-hover:translate-y-0
          duration-200 p-0 bg-gray-800/70"
        >
          <div className="flex flex-col px-2 w-full mt-auto pb-4">
            {type === "chapter" && (
              <span className="text-sm font-semibold text-gray-200 capitalize">
                chapter:
                <span className="text-primary ml-2 font-bold">
                  #{(item as ChapterResponse).chapterNumber}
                </span>
              </span>
            )}
            <h1
              className={`z-10 tracking-tight leading-5 ${titleStyle} text-gray-50`}
            >
              {title}
            </h1>
            {item.description && (
              <p className="text-md text-white font-semibold">
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

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
          <GridItem
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
