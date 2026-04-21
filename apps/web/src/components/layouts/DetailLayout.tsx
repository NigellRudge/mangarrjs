import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ReactNode } from "react";

const BackgroundImage = ({ src }: { src: string }) => {
  return (
    <div className="absolute top-0 right-0 left-0 h-[55vh]">
      <div className="absolute z-[2] h-full w-full bg-gradient-to-b to-base-100 backdrop-blur-xs"></div>
      <img
        className="lre z-[1] h-[50vh] w-full object-cover"
        src={src}
        alt="Shoes"
      />
    </div>
  );
};

const DetailLayout = ({
  children,
  backgroundImage,
}: {
  children: ReactNode;
  backgroundImage?: string;
}) => {
  return (
    <div className="relative flex h-full min-h-screen max-w-full overflow-x-hidden bg-base-100">
      {backgroundImage && <BackgroundImage src={backgroundImage} />}
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <div className="px-6 py-4 pt-22">{children}</div>
      </div>
    </div>
  );
};

export default DetailLayout;
