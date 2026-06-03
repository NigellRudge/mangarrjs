import { useEffect } from "react";

const useOnKeyPress = ({
  element,
  keycode,
  callback,
  condition = true,
}: {
  element?: any;
  keycode: string;
  callback: () => void;
  condition?: boolean;
}) => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === keycode && Boolean(callback)) {
      callback();
    }
  };
  useEffect(() => {
    const target = element || window;
    if (keycode && Boolean(callback) && condition) {
      target.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      target.removeEventListener("keydown", handleKeyPress);
    };
  }, [condition]);
};

export default useOnKeyPress;
