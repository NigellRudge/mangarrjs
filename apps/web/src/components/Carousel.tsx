import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { backendClient } from "@/http/api-client";
import useBrowserBreakpoints from "@/hooks/useBrowserBreakpoints";
import { hasItems, MangaResponse } from "@mangarr/shared";

const DELAY = 8000;

const Slide = ({
  slide,
  isActive,
  isMobile,
}: {
  slide: MangaResponse;
  isActive: boolean;
  isMobile?: boolean;
}) => (
  <div
    className={`fixed inset-0 z-[1] transition-opacity ease-in-out duration-1000 ${isActive ? "opacity-100" : "opacity-0"}`}
  >
    <Image
      fill
      sizes="100vw"
      src={(isMobile ? slide.coverImage : slide.bannerImage) || ""}
      alt={(isMobile ? slide.coverImage : slide.bannerImage) || ""}
      className={`object-cover  ${isMobile ? "object-top" : "object-center"}`}
    />
  </div>
);

const Carousel = () => {
  const { isMobileBreakpoint, isSmallBreakpoint } = useBrowserBreakpoints();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timer = useRef<any>(null);

  const { data: items = [], isValidating: isLoading } = useSWR<MangaResponse[]>(
    "trending-mangas",
    () => backendClient.getTrendingManga(),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!timer.current && !isLoading && items?.length > 0) {
      timer.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev + 1 >= items.length) {
            return 0;
          }
          return prev + 1;
        });
      }, DELAY);
    }
  }, [isLoading, items?.length]);

  return (
    <div className="w-screen h-screen z-0 absolute">
      <div
        className={`w-full h-full absolute z-[2]`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(45, 55, 72, 0.47) 0%, rgb(26, 32, 46) 100%)",
        }}
      ></div>
      {hasItems(items) &&
        items.map((item, index) => (
          <Slide
            isMobile={isMobileBreakpoint || isSmallBreakpoint}
            slide={item}
            key={item.id}
            isActive={index === currentIndex}
          />
        ))}
    </div>
  );
};

export default Carousel;
