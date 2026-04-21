import { addDays, isBefore } from "date-fns";

export type StoreData<T> = {
  data: T;
  TTL: Date;
};

export function setInLocalStorage<T>(key: string, data: T, TTL: number = 1) {
  if (!key || !data) return;
  return localStorage.setItem(
    key,
    JSON.stringify({ data, TTL: addDays(new Date(), TTL) }),
  );
}

export function getFromLocalStorage<T>(key: string): T | null {
  if (!key) return null;
  const storeData = localStorage.getItem(key);
  if (!storeData) return null;
  const { data, TTL } = JSON.parse(storeData) as StoreData<T>;
  if (!TTL || !isBefore(new Date(), TTL)) return null;
  return data;
}
