import { IconName } from "@/components/Icon";
import { ComponentType } from "react";

export interface Title {
  title: string;
  originalTitle: string;
}

export interface PublishInfo {
  year: string;
  month?: number;
  day?: number;
}

export type SettingRouteType = {
  label: string;
  iconName: IconName;
  iconNameActive: IconName;
  Component: ComponentType;
  className?: string;
};
