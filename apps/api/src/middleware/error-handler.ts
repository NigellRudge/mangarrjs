import { Request, Response } from "express";
import NotFoundError from "@errors/not-found-error";
import AuthenticationError from "@errors/authentication-errors";
import GeneralError from "@errors/general-error";

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
