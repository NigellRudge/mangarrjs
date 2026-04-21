import { NextFunction, Response } from "express";
import User from "@database/entities/user";
import { AuthenticatedRequest } from "@http/requests";

export function checkoutUserRole(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const user: User = req.user!;
  const userId = parseInt(
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
  );
  if (!user || user?.id !== userId || !user.isAdministrator) {
    res.status(401).json({ error: "not authorized" }).send();
  }
  next(req);
}
