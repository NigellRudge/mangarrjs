import NavigationLink from "@/components/NavigationLink";
import Icon, { IconName } from "@/components/Icon";

import { version, name } from "../../package.json";
import Logo from "@/components/Logo";
import { useNavigationState } from "@/providers/NavigationStateProvider";
import MenuButton from "@/components/buttons/MenuButton";
import { useRouter } from "next/router";

type RouteConfig = {
  url: string;
  label: string;
  iconName: IconName;
  activeIconName: IconName;
};
const routes: RouteConfig[] = [
  {
    url: "/",
    label: "Library",
    iconName: "folder",
    activeIconName: "folderFilled",
  },
  {
    url: "/calendar",
    label: "Calendar",
    iconName: "calendar",
    activeIconName: "calendarFilled",
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

const Sidebar = () => {
  const { pathname } = useRouter();
  const { isSideBarCollapsed, setIsSideBarCollapsed } = useNavigationState();

  return (
    <>
      <aside
        className={`
      bg-base-100 h-[100vh]
      transition-all duration-200
      ease-in-out
         z-30 lg:z-[5] ${isSideBarCollapsed ? "-translate-x-full" : "translate-x-0"} absolute lg:relative lg:translate-x-0 w-64 flex flex-col border-r border-gray-700
      `}
      >
        <div className="flex justify-between items-center">
          <Logo />
          <span className="lg:hidden">
            <MenuButton />
          </span>
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
          <div className="flex flex-col px-4 py-2 border border-gray-700 rounded-md m-2">
            <span className="text-lg text-gray-200 capitalize">{name}</span>
            <span className="text-sm text-gray-400 font-semibold">
              Current version: {version}
            </span>
          </div>
        </div>
      </aside>
      {!isSideBarCollapsed && (
        <div
          onClick={() => setIsSideBarCollapsed(true)}
          className="w-[100vw] bg-gray-600 opacity-50 z-20 h-[100vh] absolute top-0 bottom-0 right-0 left-0 "
        />
      )}
    </>
  );
};

export default Sidebar;
