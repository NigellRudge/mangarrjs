import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import AuthenticationError from "@errors/authentication-errors";
import UserService from "@services/user-service";
import { AuthenticatedRequest } from "@http/requests";
import { iocContainer } from "@iocContainer/ioc-container";
import GeneralError from "@errors/general-error";

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new GeneralError("Secret not defined");
  }
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & {
      userId: number;
    };
    if (!decoded) {
      throw new AuthenticationError("Invalid token");
    }
    const userService = iocContainer.resolve(UserService);
    req.user = await userService.getUserInformationById(decoded.userId);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
