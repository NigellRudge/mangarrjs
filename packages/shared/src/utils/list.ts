import {pickBy} from "ramda";

export const hasItems = (item: any) => {
    if (!Boolean(item) && !Array.isArray(item)) return false;
    return item.length !== 0;
};

export const joinSafe = (items: any[], separator: string = "-") => {
    return hasItems(items) ? items.filter(Boolean).join(separator) : "";
};

export function removeEmptyKeys<T>(object?: Partial<T>): Partial<T> {
    if (!object) return {};
    return pickBy((v:any) => v != null && v !== false, object);
}
