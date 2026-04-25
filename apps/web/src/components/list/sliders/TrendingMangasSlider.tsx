import useTrending from "@/hooks/useTrending";
import HorizontalSlider from "@/components/list/HorizontalSlider";

const TrendingManga = () => {
  const { trendingMangas, isLoading, type } = useTrending();

  return (
    <HorizontalSlider
      title="Trending Mangas"
      type={type}
      isLoading={isLoading}
      items={trendingMangas}
    />
  );
};

export default TrendingManga;
