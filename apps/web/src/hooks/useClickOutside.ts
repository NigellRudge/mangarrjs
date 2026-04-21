import { useEffect, useRef } from "react";

const useClickOutside = (callbackFunction: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (element && callbackFunction) {
      window.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (!element.contains(target)) {
          callbackFunction();
        }
      });
    }
    return () => {
      const element = ref.current;
      if (element) {
        window.removeEventListener("click", () => {});
      }
    };
  }, [callbackFunction]);

  return { ref };
};

export default useClickOutside;
