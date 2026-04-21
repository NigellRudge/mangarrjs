export type MetaDataKey =
  | "class:middlewares"
  | "method:middlewares"
  | "controllers"
  | "prefix"
  | "routes"
  | "design:paramtypes"
  | "custom:injectable";

export const getMetadataArray = (key: MetaDataKey, target: any) =>
  Reflect.getMetadata(key, target) || [];

export const getMetadataObject = (key: MetaDataKey, target: any) =>
  Reflect.getMetadata(key, target) || {};

export const setMetaData = (key: MetaDataKey, existing: any, target: any) =>
  Reflect.defineMetadata(key, existing, target.constructor);
