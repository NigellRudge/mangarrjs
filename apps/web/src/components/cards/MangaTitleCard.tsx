import Link from "next/link";
import Image from "next/image";
import { Chapter } from "@/types/manga";

const MangaTitleCard = ({ chapter }: { chapter: Chapter }) => {
  return (
    <Link href="/manga/test" className="relative">
      <div className="hover:scale-[1.02] group bg-base-100 transform-gpu card bg-base-10 flex-1 w-36 sm:w-40 md:w-48 transition-all duration-200 border hover:border-gray-500 border-gray-600 overflow-hidden aspect-[4/6] rounded-2xl">
        <div className="w-full aspect-[4/6] relative">
          <Image
            fill
            className="h-full w-full object-cover"
            src={chapter?.coverImage}
            alt={chapter?.coverImage}
            unoptimized
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 opacity-0
          ease-in
          transition-all
          group-hover:opacity-100 card-body
          duration-200 p-0"
        >
          <h2 className="z-10 card-title text-sm md:text-base text-gray-50  px-1 py-2">
            {chapter?.title}
          </h2>
          <div className="z-0 absolute w-full h-full bg-gray-700 opacity-80"></div>
        </div>
      </div>
    </Link>
  );
};

export default MangaTitleCard;
