import { Media } from "@/types/manga";
import SkeletonCard from "@/components/cards/SkeletonCard";
import MediaCard from "@/components/cards/MediaCard";

const placeHolderElements = Array(12).fill(0);

const ListView = ({
  items,
  isLoading,
  itemType = "manga",
}: {
  items: Media[];
  itemType: "manga" | "chapter";
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="bg-base-100 flex gap-2 flex-wrap relative">
        {placeHolderElements.map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-100 flex gap-2 flex-wrap relative">
      {items.map((element, key: number) => {
        return <MediaCard item={element} key={`${key}-${element.title}`} />;
      })}
    </div>
  );
};

export default ListView;
