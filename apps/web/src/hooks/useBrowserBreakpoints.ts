import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { applicationBreakpoints, Breakpoint } from "@/utils/constants";

const checkBreakpoints = (): Record<Breakpoint, boolean> => {
  return Object.entries(applicationBreakpoints).reduce(
    (acc, [key, value], index, array) => {
      const query = [];
      if (array[index + 1]) {
        query.push(`(max-width: ${array[index + 1][1] - 1}px)`);
      }
      if (array[index - 1]) {
        query.push(`(min-width: ${value}px)`);
      }
      const isActive = window.matchMedia(query.join(" AND "))?.matches;
      return { ...acc, [key]: isActive };
    },
    {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    },
  );
};

const useBrowserBreakpoints = () => {
  const [mediaQuery, setMediaQuery] = useState<Record<Breakpoint, boolean>>({
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false,
  });

  useEffect(() => {
    checkBreakpoints();
    window.addEventListener(
      "resize",
      debounce(() => setMediaQuery(checkBreakpoints()), 160),
    );
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return {
    isSmallBreakpoint: mediaQuery.xs,
    isMobileBreakpoint: mediaQuery.sm,
    isTabletBreakpoint: mediaQuery.md,
    isDesktopBreakpoint: mediaQuery.lg,
    isLargeBreakpoint: mediaQuery.xl,
    isExtraLargeBreakpoint: mediaQuery["2xl"],
  };
};

export default useBrowserBreakpoints;
