import Icon from "@/components/Icon";
import { useState } from "react";

const MonitorButton = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);

  return (
    <button
      onClick={() => setIsMonitoring((prev) => !prev)}
      className={`btn bg-indigo-700 text-gray-200 flex-row gap-1 cursor-pointer`}
    >
      <Icon name={isMonitoring ? "bookmarkFilled" : "bookmark"} />
      <span className="text-sm md:block hidden">Monitor</span>
    </button>
  );
};

export default MonitorButton;
