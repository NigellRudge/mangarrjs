import { ReactNode } from "react";

const EmptyLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-screen h-screen">{children}</div>;
};

export default EmptyLayout;
