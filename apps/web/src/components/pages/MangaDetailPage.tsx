import { MangaInfo } from "@/types/manga";
import MonitorButton from "@/components/buttons/MonitorButton";
import Icon from "@/components/Icon";
import BackButton from "@/components/buttons/BackButton";
import BackendImage from "@/components/BackendImage";
import { hasItems } from "@/utils/shared";

const Genres = ({ genres }: { genres?: string[] }) => (
  <div className="mt-2 flex flex-row flex-wrap items-center gap-2 md:items-start">
    {genres?.map((genre) => (
      <button
        key={genre}
        className="btn btn-primary rounded-3xl px-2 py-0.5 text-sm text-gray-100"
      >
        {genre}
      </button>
    ))}
  </div>
);

const Tags = ({ tags }: { tags?: string[] }) => (
  <div className="mt-8 flex max-w-full flex-row flex-wrap items-center gap-2 md:items-start">
    {tags?.map((tag) => (
      <span
        key={tag}
        className="size-fit cursor-pointer rounded-xl bg-indigo-800 px-3 py-1 text-sm text-gray-300 capitalize transition-all duration-200 hover:bg-base-200 hover:text-gray-200"
      >
        {tag}
      </span>
    ))}
  </div>
);

const MangaDetailPage = ({ manga }: { manga: MangaInfo }) => {
  return (
    <div className="relative flex flex-col text-gray-100">
      <div className="absolute top-0 right-0 z-[4] md:top-[16px] md:right-[16px] size-fit">
        <MonitorButton />
      </div>
      <div className="absolute top-0 left-0 z-[4] md:top-16px] md:right-[16px] size-fit">
        <BackButton />
      </div>
      <div className="z-[3] mt-4 flex flex-col gap-4 md:mt-12 md:flex-row">
        <div className="flex w-full items-center justify-center md:size-fit">
          <div className="relative max-w-[180px] w-[180px] aspect-[4/6] overflow-hidden rounded-xl border border-gray-600 md:max-w-[250px] md:min-w-[220px]">
            <BackendImage
              fill
              className="h-full w-full object-cover object-center"
              src={manga.coverImage}
              alt={manga.coverImage}
              source={manga.sourceId}
              sizes="(min-width: 768px) 200px)"
              unoptimized
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 p-0 sm:p-8 md:items-start md:p-4 xl:w-3/4">
          <div className="flex flex-row justify-center md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-center text-2xl font-bold md:text-4xl">
                {manga?.title}
              </span>
              <div className="flex flex-row items-center [&>*:not(:last-child)]:after:mx-2 [&>*:not(:last-child)]:after:hidden [&>*:not(:last-child)]:after:text-2xl [&>*:not(:last-child)]:after:text-gray-500 [&>*:not(:last-child)]:after:content-['•']">
                {Boolean(manga.averageScore) && (
                  <span className="flex flex-row items-center justify-center gap-1 p-1 text-base font-semibold text-secondary after:text-gray-500 after:content-['.']">
                    <Icon
                      className="text-warning"
                      name="star"
                      width={20}
                      height={20}
                    />
                    <span className="text-gray-300">{manga?.averageScore}</span>
                  </span>
                )}
                <span className="flex flex-row items-center justify-center p-1 text-sm font-semibold text-gray-300 md:text-base">
                  {manga?.chapters} Chapters
                </span>
                <span className="flex flex-row items-center justify-center p-1 text-sm font-semibold text-gray-300">
                  Status:
                  <button className="btn ml-1 p-1 capitalize btn-sm btn-success">
                    {manga?.status}
                  </button>
                </span>
              </div>
            </div>
          </div>
          {hasItems(manga.genres) && <Genres genres={manga.genres} />}
          <div className="text-base font-semibold">{manga?.description}</div>
          {hasItems(manga.tags) && <Tags tags={manga?.tags} />}
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
