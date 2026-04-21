import Icon from "@/components/Icon";
import { useCallback, useState } from "react";
import { copyToClipboard } from "@/utils/shared";
import MultiSelect from "@/components/inputs/MultiSelect";

const ApplicationInfo = () => {
  const [hideApiKey, setHideApiKey] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");

  const refreshApiKey = () => {};
  const copyApiKey = useCallback(
    async () => await copyToClipboard(apiKey),
    [apiKey],
  );

  return (
    <div className="flex flex-col gap-3 w-full lg:max-w-[60vw]">
      <fieldset className="border border-gray-600 rounded-lg p-4 bg-base-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <label
            className="label font-semibold text-gray-400"
            htmlFor="selectedFolder"
          >
            Api Key
          </label>
          <div className="flex flex-row join flex-1 md:max-w-[70%]">
            <input
              type="text"
              placeholder="data/mangas"
              name="selectedFolder"
              className="input flex-1 join-item placeholder-gray-600"
            />

            <button
              onClick={() => setHideApiKey((prev) => !prev)}
              className="btn btn-primary border-r "
            >
              <Icon name={hideApiKey ? "show" : "hide"} />
            </button>
            <button onClick={refreshApiKey} className="btn btn-primary">
              <Icon name="refresh" />
            </button>
            <button
              onClick={copyApiKey}
              className="btn btn-primary rounded-tr-md rounded-br-md"
            >
              <Icon name="copy" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <label
            htmlFor="langauge"
            className="label font-semibold text-gray-400"
          >
            Language
          </label>
          <select
            defaultValue="English"
            className="select placeholder-gray-400 text-gray-300 flex-1 md:max-w-[70%] "
          >
            <option value="english">English</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <label
            htmlFor="langauge"
            className="label font-semibold text-gray-400"
          >
            Manga languages
          </label>
          <MultiSelect
            className="text-gray-300 flex-1 md:max-w-[70%]"
            options={[
              { label: "English", value: "English" },
              { label: "Japanese", value: "Japanese" },
              { label: "Chinese", value: "Chinese" },
            ]}
          />
        </div>
      </fieldset>
    </div>
  );
};

const Folders = () => {
  const selectFolder = async () => {};
  return (
    <div className="flex flex-col gap-3 w-full lg:max-w-[60vw]">
      <div className="flex flex-row">
        <h3 className="text-xl font-semibold text-gray-300">Folders</h3>
      </div>
      <fieldset className="border border-gray-600 rounded-lg p-4 bg-base-200">
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <label
            className="label font-semibold text-gray-400"
            htmlFor="selectedFolder"
          >
            Download Folder
          </label>
          <div className="flex flex-row join flex-1 md:max-w-[70%]">
            <input
              type="text"
              placeholder="data/mangas"
              name="selectedFolder"
              className="input flex-1 join-item placeholder-gray-600"
            />
            <button
              onClick={() => selectFolder()}
              className="btn btn-primary join-item"
            >
              <Icon name="folder2" />
              <span className="hidden md:block">Select Folder</span>
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

const GeneralSettings = () => {
  return (
    <div className="flex flex-col gap-5 py-4 animate-fadein">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-200">General Settings</h2>
        <p className="text-base font-semibold text-gray-400">
          Configure important application with settings
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <Folders />
        <ApplicationInfo />
      </div>
    </div>
  );
};

export default GeneralSettings;
