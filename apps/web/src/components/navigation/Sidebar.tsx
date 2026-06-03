import NavigationLink from "@/components/navigation/NavigationLink";
import Icon, { IconName } from "@/components/shared/Icon";

import { version } from "../../../package.json";
import Logo from "@/components/shared/Logo";
import { useNavigationState } from "@/providers/NavigationStateProvider";
import { useRouter } from "next/router";
import useOnKeyPress from "@/hooks/useOnKeyPress";

type RouteConfig = {
  url: string;
  label: string;
  iconName: IconName;
  activeIconName: IconName;
};
const routes: RouteConfig[] = [
  {
    url: "/",
    label: "Trending",
    iconName: "folder",
    activeIconName: "folderFilled",
  },
  {
    url: "manga",
    label: "Mangas",
    iconName: "book",
    activeIconName: "book",
  },
  {
    url: "/tasks",
    label: "Tasks",
    iconName: "task",
    activeIconName: "taskFilled",
  },
  {
    url: "/settings",
    label: "Settings",
    iconName: "gear",
    activeIconName: "gearFilled",
  },
];

const isRouteActive = (route: RouteConfig, path: string) => {
  if (route.url === "/") return path === "/";
  return path.startsWith(route.url);
};

const CloseButton = () => {
  const { setIsSideBarCollapsed } = useNavigationState();
  return (
    <div className="lg:hidden flex">
      <button
        onClick={() => setIsSideBarCollapsed(true)}
        className="flex align-center justify-center p-2 lg:hidden absolute top-1 right-1 btn btn-link"
      >
        <Icon name="close" className="text-gray-200" size={32} />
      </button>
    </div>
  );
};

const Sidebar = () => {
  const { pathname } = useRouter();
  const { isSideBarCollapsed, setIsSideBarCollapsed } = useNavigationState();

  useOnKeyPress({
    keycode: "Escape",
    callback: () => setIsSideBarCollapsed(true),
  });

  return (
    <>
      <aside
        className={`
      bg-base-100 h-[100vh]
      transition-all duration-200
      ease-in-out
         z-30 lg:z-[5] ${isSideBarCollapsed ? "-translate-x-full" : "translate-x-0"} fixed lg:relative lg:translate-x-0 w-64 flex flex-col border-r border-gray-700
      `}
      >
        <div className="flex justify-between items-center relative md:pt-4">
          <Logo />
          <CloseButton />
        </div>
        <div className="flex flex-col justify-between grow">
          <nav className="flex-1 px-4 pt-4 space-y-1 flex flex-col gap-2">
            {routes.map((route, index: number) => {
              const isActive = isRouteActive(route, pathname);
              return (
                <NavigationLink
                  isActive={isActive}
                  key={`${route.url}-${index}`}
                  url={route.url}
                  label={route.label}
                  leftIcon={
                    <Icon
                      name={isActive ? route.activeIconName : route.iconName}
                      className={isActive ? "text-primary" : ""}
                      width={24}
                      height={24}
                    />
                  }
                />
              );
            })}
          </nav>

          <span className="text-sm text-gray-400 font-semibold p-4">
            Version: {version}
          </span>
        </div>
      </aside>
      {!isSideBarCollapsed && (
        <div
          onClick={() => setIsSideBarCollapsed(true)}
          className="w-[100vw] bg-gray-700/80 opacity-50 z-20 h-[100vh] absolute top-0 bottom-0 right-0 left-0 animate-sidebar duration-200"
        />
      )}
    </>
  );
};

export default Sidebar;
