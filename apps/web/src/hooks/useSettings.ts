import { useContext } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";

const useSettings = () => useContext(SettingsContext);

export default useSettings;
