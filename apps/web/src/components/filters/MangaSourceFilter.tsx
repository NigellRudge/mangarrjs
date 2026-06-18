import useDiscoverManga from "@/hooks/useDiscoverManga";
import { MangaSourceType } from "@mangarr/shared";
import Select, { OptionProps } from "react-select";
import Image from "next/image";

const MANGA_SOURCE_LOGO_MAP: Record<string, string> = {
  "manga-dex": "manga-dex.svg",
  "manga-pill": "manga-pill.png",
  "ani-list": "ani-list.png",
};

type MangaSourceOption = {
  value: string;
  label: string;
};

const CustomOptions = ({
  innerProps,
  innerRef,
  data,
}: OptionProps<MangaSourceOption, true>) => {
  const value = data.value;
  const mangaSourceLogo = MANGA_SOURCE_LOGO_MAP[value];

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex flex-row gap-2 p-2 items-center hover:bg-gray-600 transition-colors duration-200 ease-in-out"
    >
      {Boolean(mangaSourceLogo) && (
        <Image
          src={`/logos/${mangaSourceLogo}`}
          width={24}
          height={24}
          sizes={"80px"}
          className="rounded-full"
          alt={mangaSourceLogo}
        />
      )}
      <span className="text-gray-200 text-sm">{data.label}</span>
    </div>
  );
};

const MangaSourceFilter = () => {
  const { sources, updateActiveFiltersForKey, activeFilters } =
    useDiscoverManga();
  const selected = sources.filter((source) =>
    activeFilters.sources?.includes(source.value as MangaSourceType),
  );

  return (
    <div className="flex flex-col gap-2 px-2">
      <h3 className="text-gray-200 text-lg">MangaSources</h3>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={sources}
        isMulti
        value={selected}
        placeholder="Select Status"
        components={{ Option: CustomOptions }}
        onChange={(data) => {
          updateActiveFiltersForKey(
            "sources",
            Array.from(
              data.values().map((val) => val.value as MangaSourceType),
            ),
          );
        }}
      />
    </div>
  );
};

export default MangaSourceFilter;
