import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ReactNode } from "react";

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
