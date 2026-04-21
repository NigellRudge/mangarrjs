import { useRef, useState, useEffect } from "react";

const useIsHovering = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isHoveringLong, setIsHoveringLong] = useState<boolean>(false);
  const ref = useRef<any | null>(null);

  useEffect(() => {
    const container = ref.current;
    let timer: any;

    if (container) {
      container.addEventListener("mouseenter", () => {
        setIsHovering(false);
        clearTimeout(timer);
        setIsHovering(true);
        timer = setTimeout(() => setIsHoveringLong(true), 2000);
      });
      container.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        setIsHovering(false);
        setIsHoveringLong(false);
      });
    }

    return () => {
      const container = ref.current;
      if (container) {
        container.removeEventListener("mouseenter", () => {});
        container.removeEventListener("mouseleave", () => {});
      }
    };
  }, []);

  return {
    ref,
    isHovering,
    isHoveringLong,
  };
};

export default useIsHovering;
