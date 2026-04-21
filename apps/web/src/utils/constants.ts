export const applicationBreakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1025,
  xl: 1200,
  ["2xl"]: 1600,
} as const;

export type Breakpoint = keyof typeof applicationBreakpoints;
