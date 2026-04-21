import { useEffect, useRef, useState } from "react";
import { throttle } from "lodash";

const THROTTLE_DELAY = 166.62;

const useHasElementScrolled = (offset: number = 32) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScrollPosition = throttle(() => {
      if (!ref.current) return;
      const { scrollTop } = ref.current || { scrollTop: 0 };
      setIsScrolled(scrollTop >= offset);
    }, THROTTLE_DELAY);

    const target = ref.current || window;
    target.addEventListener("scroll", checkScrollPosition);

    checkScrollPosition();
    return () => {
      target.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return {
    ref,
    isScrolled,
  };
};

export default useHasElementScrolled;
