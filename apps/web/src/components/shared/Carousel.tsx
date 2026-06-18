import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { backendClient } from "@/http/api-client";
import useBrowserBreakpoints from "@/hooks/useBrowserBreakpoints";
import {
  getRandomItemFromList,
  hasItems,
  MangaMedia,
  MangaResponse,
} from "@mangarr/shared";
import BackendImage from "@/components/image/BackendImage";

const DELAY = 8000;

const Slide = ({
  slide,
  isActive,
  isMobile,
}: {
  slide: MangaResponse;
  isActive: boolean;
  isMobile?: boolean;
}) => {
  const media = useMemo(() => {
    const covers = slide.media.filter((media) => media.type === "cover");
    const banners = slide.media.filter((media) => media.type === "banner");
    const selectedMedia = isMobile ? covers : banners;
    return getRandomItemFromList<MangaMedia>(selectedMedia);
  }, []);

  if (!media) return null;

  return (
    <div
      className={`fixed inset-0 z-[1] transition-opacity ease-in-out duration-1000 ${isActive ? "opacity-100" : "opacity-0"}`}
    >
      <BackendImage
        fill
        sizes="100vw"
        src={media.url}
        alt={media.url}
        source={media.sourceId}
        className={`object-cover  ${isMobile ? "object-top" : "object-center"}`}
      />
    </div>
  );
};

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
