import useDiscoverManga from "@/hooks/useDiscoverManga";
import Icon from "@/components/shared/Icon";
import Select from "react-select";
import Flyout from "@/components/shared/Flyout";
import MangaSourceFilter from "@/components/filters/MangaSourceFilter";

const ClearFiltersButton = () => {
  const { clearFilters } = useDiscoverManga();
  return (
    <div className="px-2">
      <button
        onClick={clearFilters}
        className="btn bg-base-200 hover:bg-gray-600 flex flex-row gap-4 border border-gray-500 w-full group transition-colors ease-in-out"
      >
        <Icon name="clear" className="text-gray-100" />
        <span className="text-gray-100 text-md">Clear Filter</span>
      </button>
    </div>
  );
};

const ShowAdultContentFilter = () => {
  const { activeFilters, updateActiveFiltersForKey } = useDiscoverManga();
  return (
    <div className="flex flex-col gap-3 px-2">
      <h3 className="text-gray-200 text-lg">Include Adult Content</h3>
      <input
        type="checkbox"
        checked={activeFilters.includeAdultContent}
        onChange={(e) => {
          updateActiveFiltersForKey("includeAdultContent", e.target.checked);
        }}
        className="toggle border-gray-500 bg-gray-500 checked:border-indigo-500 checked:bg-indigo-400 checked:text-gray-200"
      />
    </div>
  );
};

const GenreFilter = () => {
  const { genres, updateActiveFiltersForKey, activeFilters } =
    useDiscoverManga();
  const selected = genres.filter((genre) =>
    activeFilters.genres?.includes(genre.value),
  );
  return (
    <div className="flex flex-col gap-3 px-2">
      <h3 className="text-gray-200 text-lg">Genres</h3>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={genres}
        isMulti
        value={selected}
        placeholder="Select a Genre"
        onChange={(data) => {
          updateActiveFiltersForKey(
            "genres",
            Array.from(data.values().map((val) => val.value)),
          );
        }}
      />
    </div>
  );
};

const MediaTypeFilter = () => {
  const { mediaTypes, updateActiveFiltersForKey, activeFilters } =
    useDiscoverManga();
  const selected = mediaTypes.filter((type) =>
    activeFilters.mediaTypes?.includes(type.value),
  );
  return (
    <div className="flex flex-col gap-3 px-2">
      <h3 className="text-gray-200 text-lg">Media</h3>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={mediaTypes}
        isMulti
        value={selected}
        placeholder="Select a type of media"
        onChange={(data) => {
          updateActiveFiltersForKey(
            "mediaTypes",
            Array.from(data.values().map((val) => val.value)),
          );
        }}
      />
    </div>
  );
};

const StatusFilter = () => {
  const { statusTypes, updateActiveFiltersForKey, activeFilters } =
    useDiscoverManga();
  const selected = statusTypes.filter((status) =>
    activeFilters.statusTypes?.includes(status.value),
  );
  return (
    <div className="flex flex-col gap-2 px-2">
      <h3 className="text-gray-200 text-lg">Status</h3>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={statusTypes}
        isMulti
        value={selected}
        placeholder="Select Status"
        onChange={(data) => {
          updateActiveFiltersForKey(
            "statusTypes",
            Array.from(data.values().map((val) => val.value)),
          );
        }}
      />
    </div>
  );
};

const DiscoverFilters = () => {
  const {
    openFilterFlyOut,
    closeFilterFlyOut,
    numberOfActiveFilters,
    isFiltersFlyoutOpen,
  } = useDiscoverManga();

  return (
    <>
      <div className="flex flex-row gap-4">
        <button
          onClick={openFilterFlyOut}
          className="text-gray-50 h-10 items-center justify-center flex flex-row w-full md:w-48 border rounded-lg border-gray-700 bg-base-200 gap-4 cursor-pointer hover:border-gray-400 hover:bg-gray-700 transition-colors duration-200 ease-in-out"
        >
          <Icon name="filter" />
          <span className="">{numberOfActiveFilters} Filters</span>
        </button>
      </div>
      <Flyout
        isOpen={isFiltersFlyoutOpen}
        onClose={closeFilterFlyOut}
        footer={<ClearFiltersButton />}
        title="Filters"
        subTitle={`${numberOfActiveFilters} Active filters`}
      >
        <div className="flex flex-col gap-5">
          <GenreFilter />
          <MediaTypeFilter />
          <StatusFilter />
          <MangaSourceFilter />
          <ShowAdultContentFilter />
        </div>
      </Flyout>
    </>
  );
};

export default DiscoverFilters;
