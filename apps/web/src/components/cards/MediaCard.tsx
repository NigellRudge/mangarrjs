import Link from "next/link";
import { ChapterResponse, joinSafe, MangaResponse } from "@mangarr/shared";
import { TypeIndicator } from "@/components/list/shared";
import BackendImage from "@/components/image/BackendImage";
import Icon from "@/components/shared/Icon";

const MonitorMangaButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="btn btn-primary btn-sm border cursor-pointer rounded-lg  items-center justify-center flex flex-row gap-3"
    >
      <Icon
        name="download"
        className="group-hover:text-gray-100  transition-colors duration-300 ease-in-out  text-gray-300"
        size={16}
      />
      <span className="text-sm group-hover:text-gray-100  transition-colors duration-300 ease-in-out  text-gray-300">
        Monitor
      </span>
    </button>
  );
};

const MediaCard = ({
  item,
  type,
  loadEager,
  canExpand = true,
}: {
  item: MangaResponse | ChapterResponse;
  type: "manga" | "chapter";
  loadEager?: boolean;
  canExpand?: boolean;
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
      <div
        className={`hover:scale-[1.02] transform-gpu will-change-transform hover:z-10 border  group bg-base-100 bg-base-10 ${canExpand ? "w-full" : "w-36 sm:w-36 md:w-44"} transition-all duration-200 hover:border-gray-300 border-gray-500 overflow-hidden aspect-[4/6] rounded-xl`}
      >
        <TypeIndicator type={type} />
        <div className="w-full h-full relative ">
          <BackendImage
            fill
            loading={loadEager ? "eager" : "lazy"}
            className="h-full w-full object-cover inset-0"
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
          duration-200 p-0 bg-gray-800/80"
        >
          <div className="flex flex-col px-2 w-full mt-auto pb-2 gap-2">
            {type === "chapter" && (
              <span className="text-sm font-semibold text-gray-200 capitalize">
                chapter:
                <span className="text-primary ml-2 font-bold">
                  #{(item as ChapterResponse).chapterNumber}
                </span>
              </span>
            )}
            <h1
              className={`z-10 tracking-tight md:text-sm text-base font-semibold leading-5 ${titleStyle} text-gray-50`}
            >
              {title}
            </h1>
            {item.description && (
              <p className="text-md text-white font-semibold">
                {item.description}
              </p>
            )}
            <MonitorMangaButton
              onClick={() => console.log(`monitor mange: ${item.id}`)}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
