export const titleCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
};

export const paramCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str.toLowerCase().replace(/\s+/g, "-");
};

export const sentenceCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str
    .toLowerCase()
    .replace(/^\s*\S|[.!?]\s*\S/g, (char) => char.toUpperCase());
};

export const upperCaseFirst = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const kebabCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export const camelCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str.replace(/(?:^|\s+)(\S)/g, (match, char, index) =>
    index === 0 ? char.toLowerCase() : char.toUpperCase(),
  );
};

export const snakeCase = (str: string = ""): string => {
  if (!str || !(typeof str === "string")) return str;
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .toLowerCase();
};
