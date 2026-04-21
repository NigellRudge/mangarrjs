import useNewChapters from "@/hooks/useNewChapters";
import MediaCard from "@/components/cards/MediaCard";

const Skeleton = () => {
  return (
    <div className="skeleton aspect-[4/6] w-36 sm:w-40 md:w-48 rounded-2xl"></div>
  );
};

const ItemGrid = () => {
  const { newChapters, isLoading } = useNewChapters();

  return (
    <div className="bg-base-100 flex gap-2 flex-wrap relative">
      {isLoading &&
        Array(8)
          .fill(0)
          .map((_, i) => <Skeleton key={i} />)}
      {!isLoading &&
        newChapters?.map((manga: any) => (
          <MediaCard key={manga.title} item={manga} />
        ))}
    </div>
  );
};

export default ItemGrid;
