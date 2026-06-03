import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon, { IconName } from "@/components/shared/Icon";
import debounce from "lodash/debounce";
import { ChapterResponse, hasItems, MangaResponse } from "@mangarr/shared";
import MediaCard from "@/components/cards/MediaCard";

const Skeleton = () => (
  <div className="mx-1 py-1">
    <div className="skeleton h-full aspect-[4/6] w-36 sm:w-36 md:w-44"></div>
  </div>
);

const SliderButton = ({
  onClick = () => {},
  iconName,
  disabled,
}: {
  onClick?: () => void;
  iconName: IconName;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className="btn btn-ghost flex items-center justify-center p-0"
      onClick={onClick}
    >
      <Icon
        size={32}
        name={iconName}
        className={`transition-colors duration-200 ease-in-out ${disabled ? "text-gray-400" : "text-gray-50"}`}
      />
    </button>
  );
};

const CustomControls = ({
  onNext = () => {},
  onPrev = () => {},
  isStart,
  isEnd,
}: {
  onNext?: () => void;
  onPrev?: () => void;
  isStart?: boolean;
  isEnd?: boolean;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <SliderButton
        disabled={isStart}
        iconName="chevronLeft"
        onClick={onPrev}
      />
      <SliderButton disabled={isEnd} iconName="chevronRight" onClick={onNext} />
    </div>
  );
};

const useSlider = ({
  items,
  isLoading,
}: {
  items?: MangaResponse[] | ChapterResponse[];
  isLoading?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState({ isStart: true, isEnd: false });

  const handleScroll = useCallback(() => {
    const scrollWidth = containerRef.current?.scrollWidth ?? 0;
    const clientWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    const scrollPosition = containerRef.current?.scrollLeft ?? 0;

    if (isLoading || !items || items?.length === 0) {
      setScrollPos({ isStart: true, isEnd: true });
    } else if (clientWidth >= scrollWidth) {
      setScrollPos({ isStart: true, isEnd: true });
    } else if (scrollPosition >= scrollWidth - clientWidth) {
      setScrollPos({ isStart: false, isEnd: true });
    } else if (scrollPosition > 0) {
      setScrollPos({ isStart: false, isEnd: false });
    } else {
      setScrollPos({ isStart: true, isEnd: false });
    }
  }, [items, isLoading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 50),
    [handleScroll],
  );

  useEffect(() => {
    const handleResize = () => {
      debouncedScroll();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [debouncedScroll]);

  // useEffect(() => {
  //   handleScroll();
  // }, [items, isLoading, handleScroll]);

  const onScroll = () => {
    debouncedScroll();
  };

  const slide = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const clientWidth = container.clientWidth;
    const cardWidth =
      container.firstElementChild?.getBoundingClientRect().width ?? 0;

    const gap = 8;
    const visibleItems = Math.max(1, Math.floor(clientWidth / cardWidth));
    const step = visibleItems * (cardWidth + gap);

    const maxScroll = container.scrollWidth - clientWidth;
    const current = container.scrollLeft;

    const newX =
      direction === "left"
        ? Math.max(current - step, 0)
        : Math.min(current + step, maxScroll);

    container.scrollTo({
      left: newX,
      behavior: "smooth",
    });
  };

  return {
    slide,
    containerRef,
    onScroll,
    isEnd: scrollPos.isEnd,
    isStart: scrollPos.isStart,
  };
};

const HorizontalSlider = ({
  title,
  items,
  type = "manga",
  isLoading,
}: {
  title: string;
  items?: MangaResponse[] | ChapterResponse[];
  type?: "manga" | "chapter";
  isLoading?: boolean;
}) => {
  const { slide, containerRef, onScroll, isStart, isEnd } = useSlider({
    items,
    isLoading,
  });

  if (!hasItems(items)) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-gray-100 text-2xl font-bold">{title}</h2>
        <CustomControls
          isStart={isStart}
          isEnd={isEnd}
          onPrev={() => slide("left")}
          onNext={() => slide("right")}
        />
      </div>
      <div
        className="flex flex-row hide-scrollbar relative gap-[8px] overflow-y-auto overflow-x-scroll overscroll-x-contain whitespace-nowrap px-2 py-2"
        ref={containerRef}
        onScroll={onScroll}
      >
        {hasItems(items) &&
          items?.map((item) => (
            <MediaCard
              type={type}
              item={item}
              key={item.id}
              canExpand={false}
            />
          ))}

        {isLoading &&
          Array(8)
            .fill(0)
            .map((_, i) => <Skeleton key={i} />)}
      </div>
    </div>
  );
};

export default HorizontalSlider;
