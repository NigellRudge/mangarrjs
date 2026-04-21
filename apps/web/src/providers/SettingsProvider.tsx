import { createContext, ReactNode } from "react";
import { version, repository, license } from "../../package.json";

type KavitaSetting = {
  url: string;
  userName: string;
  password: string;
  active: boolean;
};

type KomgaSetting = {
  url: string;
  userName: string;
  password: string;
  active: boolean;
};

type AboutInfo = {
  version: string;
  repo: string;
  license: string;
};

type NotificationSetting = {
  apiKey: string;
  url: string;
  active: boolean;
};

type AccountSettings = {
  userName: string;
  email: string;
  avatar: string;
};

type SettingsContextType = {
  services?: (KavitaSetting | KomgaSetting)[];
  notifications?: NotificationSetting[];
  account: AccountSettings;
  about: AboutInfo;
};

const defaultSettings: SettingsContextType = {
  services: [],
  notifications: [],
  account: {
    userName: "Deyon Rudge",
    avatar: "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
    email: "test@test.com",
  },
  about: {
    version: version,
    repo: repository,
    license: license,
  },
};

export const SettingsContext =
  createContext<SettingsContextType>(defaultSettings);

const SettingsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsContext.Provider value={defaultSettings}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
