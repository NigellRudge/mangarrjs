import { ComponentType, useState } from "react";
import { IconName } from "@/components/Icon";
import dynamic from "next/dynamic";
import TabHeader from "@/components/TabHeader";

type SettingRouteType = {
  label: string;
  iconName: IconName;
  iconNameActive: IconName;
  Component: ComponentType;
  className?: string;
};

const settingsPages: SettingRouteType[] = [
  {
    label: "General",
    iconName: "info",
    iconNameActive: "info",
    className: "animate-bounce",
    Component: dynamic(() => import("@/components/forms/GeneralSettingsForm")),
  },
  {
    label: "Notifications",
    iconName: "notifications",
    iconNameActive: "notificationsFilled",
    className: "animate-shake",
    Component: dynamic(() => import("@/components/forms/NotificationsForm")),
  },
  {
    label: "Account",
    iconName: "user",
    iconNameActive: "userFilled",
    className: "animate-bounce",
    Component: dynamic(() => import("@/components/forms/AccountForm")),
  },
  {
    label: "Connected Apps",
    iconName: "services",
    iconNameActive: "servicesFilled",
    className: "animate-pulse",
    Component: dynamic(() => import("@/components/forms/ConnectedApps")),
  },
];

const SettingsPage = () => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const Component = settingsPages[activePageIndex].Component;

  return (
    <div className="flex flex-col">
      <TabHeader
        settingsPages={settingsPages}
        onClick={(index) => setActivePageIndex(index)}
        activePageIndex={activePageIndex}
      />

      <div className="pt-4">
        <Component />
      </div>
    </div>
  );
};

export default SettingsPage;
