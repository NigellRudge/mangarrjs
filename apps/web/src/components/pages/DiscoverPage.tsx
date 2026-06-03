import Grid from "@/components/list/Grid";
import useDiscoverManga from "@/hooks/useDiscoverManga";
import DiscoverFilters from "@/components/filters/DiscoverFilters";

const DiscoverPage = () => {
  const { mangas, type, isLoading, fetchMore } = useDiscoverManga();

  return (
    <div className="flex flex-col gap-4 relative max-w-screen">
      <div className="flex flex-col md:flex-row md:justify-between justify-start gap-3 md:gap-0">
        <h2 className="md:text-2xl text-xl font-semibold text-gray-50">
          Mangas
        </h2>
        <DiscoverFilters />
      </div>
      <Grid
        items={mangas}
        type={type}
        isLoading={isLoading}
        onEndReached={fetchMore}
      />
    </div>
  );
};

export default DiscoverPage;
