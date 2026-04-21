import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Head from "next/head";

import { name } from "../../../package.json";
import useHasElementScrolled from "@/hooks/useHasElementScrolled";

const Layout = ({ children }: { children: ReactNode }) => {
  const { ref, isScrolled } = useHasElementScrolled();

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <div className="flex h-screen max-w-full overflow-hidden">
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
