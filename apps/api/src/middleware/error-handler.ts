import { Request, Response } from "express";
import {
  GeneralError,
  NotFoundError,
  AuthenticationError,
} from "@mangarr/shared/errors";

export const errorHandler = (
  err: AuthenticationError | NotFoundError | GeneralError,
  req: Request,
  res: Response,
  next: any,
) => {
  console.log(err);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message })
    .send();
};
