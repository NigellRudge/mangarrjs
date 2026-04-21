import { useEffect, useRef, useState } from "react";
import { SettingRouteType } from "@/types/shared";
import Icon, { IconName } from "@/components/Icon";

const Tab = ({
  label,
  isActive,
  onClick,
  iconName,
  onRef,
  className,
}: {
  label: string;
  iconName: IconName;
  isActive: boolean;
  onClick: () => void;
  onRef: (ref?: any) => void;
  className?: string;
}) => (
  <div
    role="tab"
    onClick={onClick}
    ref={(ref) => onRef(ref)}
    className={`tab flex flex-1 px-0 mr-4 before:transition-colors before:duration-200 md:flex-none gap-1.5 flex-row pb-0 transition-colors ease-in-out duration-200 ${isActive ? "tab-active text-white before:text-secondary" : "hover:text-gray-200 hover:-[before:text-gray-200]"}`}
  >
    <span className="font-semibold text-lg md:text-base ">{label}</span>
    <span className="md:flex hidden">
      <Icon
        className={`${className} ${isActive ? "text-warning" : ""}`}
        size={16}
        name={iconName}
      />
    </span>
  </div>
);

const MobileTabHeader = ({
  onClick,
  settingsPages,
}: {
  settingsPages: SettingRouteType[];
  onClick: (index: number) => void;
}) => {
  return (
    <div className="flex flex-1 md:hidden">
      <select
        defaultValue="English"
        name="langauge"
        className="select select-md flex-1 md:max-w-[70%] text-gray-300 "
      >
        {settingsPages.map(({ label }, index: number) => {
          return (
            <option
              key={`select-${index}-${label}`}
              onClick={() => onClick(index)}
              label={label}
            >
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const TabHeader = ({
  onClick,
  activePageIndex,
  settingsPages,
}: {
  settingsPages: SettingRouteType[];
  onClick: (index: number) => void;
  activePageIndex: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRefs = useRef<Record<number, any>>({});
  const [offset, setOffset] = useState({
    left: 0,
    width: 0,
  });
  const handleRef = (key: number) => (ref?: HTMLDivElement) => {
    if (!Boolean(ref)) return;
    if (!tabsRefs?.current[key]) {
      tabsRefs.current[key] = ref;
    }
  };

  useEffect(() => {
    const container = containerRef.current as HTMLElement;
    const currentActiveTab = tabsRefs.current[activePageIndex] as HTMLElement;
    if (container && currentActiveTab) {
      setOffset(() => ({
        left:
          currentActiveTab?.getBoundingClientRect()?.left -
          container?.getBoundingClientRect()?.left,
        width: currentActiveTab?.getBoundingClientRect()?.width,
      }));
    }
  }, [activePageIndex]);

  return (
    <>
      <MobileTabHeader
        onClick={(index) => onClick(index)}
        settingsPages={settingsPages}
      />
      <div className="relative hidden md:block">
        <div
          ref={containerRef}
          role="tablist"
          className="tabs pt-0 md:pt-4 pb-1  md:justify-start justify-between"
        >
          {settingsPages.map(
            ({ label, iconName, iconNameActive, className }, index: number) => {
              const isActive = activePageIndex === index;

              return (
                <Tab
                  onClick={() => onClick(index)}
                  label={label}
                  key={label}
                  isActive={isActive}
                  iconName={isActive ? iconNameActive : iconName}
                  onRef={handleRef(index)}
                  // @ts-ignore
                  className={isActive && className}
                />
              );
            },
          )}
        </div>

        <div
          className="absolute bottom-0 h-[2px] bg-warning transition-all duration-300 ease-out"
          style={{
            left: offset.left,
            width: offset.width,
          }}
        />
      </div>
    </>
  );
};

export default TabHeader;
