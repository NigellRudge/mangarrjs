import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Head from "next/head";

import { name } from "../../../package.json";
import useHasElementScrolled from "@/hooks/useHasElementScrolled";
import BackendImage from "@/components/BackendImage";
import { MangaSourceType } from "@mangarr/shared";

const BackgroundImage = ({
  src,
  sourceId,
}: {
  src?: string;
  sourceId?: MangaSourceType;
}) => {
  if (!src || !sourceId) return null;
  return (
    <div className="absolute top-0 right-0 left-0 h-[55vh]">
      <div className="absolute z-[2] h-full w-full bg-gradient-to-b to-base-100 backdrop-blur-xs"></div>
      <BackendImage
        className="lre z-[1] h-[50vh] w-full object-cover"
        src={src}
        sizes="100vw"
        source={sourceId}
        alt="Shoes"
      />
    </div>
  );
};

const Layout = ({
  children,
  backgroundImage,
}: {
  children: ReactNode;
  backgroundImage?: {
    src?: string;
    sourceId?: MangaSourceType;
  };
}) => {
  const { ref, isScrolled } = useHasElementScrolled();

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div className="flex h-screen max-w-full overflow-hidden">
        {Boolean(backgroundImage) && (
          <BackgroundImage
            src={backgroundImage!.src}
            sourceId={backgroundImage!.sourceId}
          />
        )}
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Header isScrolled={isScrolled} />

          <div
            className="flex-1 overflow-y-scroll p-6 bg-base-100 pt-22 relative"
            ref={ref}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
