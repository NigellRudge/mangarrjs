const DEFAULT_TTL = 60;

export type TTLString = `${number}${"m" | "h" | "d" | "M" | "H" | "D"}`;
const TTLMultipliers: Record<string, number> = {
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export function parseTTL(input: number | TTLString): number {
  if (!input) return DEFAULT_TTL;
  if (typeof input === "number") return input;

  const match = input.trim().match(/^(\d+)\s*([mhdMHD])$/) as RegExpMatchArray;
  if (!match) {
    throw new Error(`Invalid TTL format: ${input}`);
  }
  const [_, value, unit] = match;
  return Math.abs(parseInt(value, 10)) * TTLMultipliers[unit.toLowerCase()];
}
