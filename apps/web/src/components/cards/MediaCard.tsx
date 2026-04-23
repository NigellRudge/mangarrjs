import Link from "next/link";
import Image from "next/image";
import { ChapterResponse, joinSafe, MangaResponse } from "@mangarr/shared";

const MediaCard = ({
  item,
  type = "manga",
}: {
  item: MangaResponse | ChapterResponse;
  type?: "manga" | "chapter";
}) => {
  const id = type === "manga" ? item.id : (item as ChapterResponse).mangaId;
  const slug = joinSafe([id, item.sourceId], "_");

  return (
    <Link href={`/manga/${slug}`} className="relative">
      <div className="hover:scale-[1.02] border  group bg-base-100 transform-gpu card bg-base-10 flex-1 w-36 sm:w-40 md:w-48 transition-all duration-200 hover:border-gray-300 border-gray-500 overflow-hidden aspect-[4/6] rounded-xl">
        <div className="w-full h-full relative ">
          <Image
            fill
            className="h-full w-full object-cover"
            src={item?.coverImage}
            alt={item?.coverImage}
            sizes="(min-width: 768px) 200px)"
            unoptimized
          />
        </div>

        <div
          className="absolute inset-0 opacity-0
          ease-in
          transition-all
          group-hover:opacity-100 card-body
          duration-200 p-0 bg-gray-800/70"
        >
          <div className="flex flex-col px-2 w-full mt-auto pb-4">
            {type === "chapter" && (
              <span className="text-sm">
                chapter: #{(item as ChapterResponse).chapterNumber}
              </span>
            )}

            <h1 className="z-10 text-md font-extrabold md:text-lg text-gray-50">
              {item?.title}
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

export default MediaCard;
