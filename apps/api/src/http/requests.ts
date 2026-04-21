import User from "@database/entities/user";
import { Request } from "express";

export type AuthenticatedRequest = Request & {
  user?: User | null;
};
