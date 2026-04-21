export const copyToClipboard = async (data: string) =>
  await navigator.clipboard.writeText(data);

export const hasItems = (item: any) => {
  if (!Boolean(item) && !Array.isArray(item)) return false;
  return item.length !== 0;
};

export const joinSafe = (items: any[], separator: string = "-") => {
  return hasItems(items) ? items.filter(Boolean).join(separator) : "";
};
