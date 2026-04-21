import { Request, Response } from "express";
import UserService from "@services/user-service";
import AuthenticationError from "@errors/authentication-errors";
import GeneralError from "@errors/general-error";
import { getRequestParams } from "@utils/request-utils";
import { AuthenticatedRequest } from "@http/requests";
import Injectable from "@decorators/injectable";
import Controller from "@decorators/controller";
import { Delete, Get, Post } from "@decorators/request-methods";
import { UseMiddleware } from "@decorators/middleware";
import { authenticateToken } from "@middleware/auth-middleware";

@Injectable()
@UseMiddleware(authenticateToken)
@Controller("/user")
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createNewUser(req: any, res: Response) {
    const user = req.user as any;
    if (!user) {
      throw new AuthenticationError("Incorrect credentials");
    }
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      throw new GeneralError("not data provided");
    }
    const success = await this.userService.create({
      username,
      email,
      password,
    });
  }

  @Delete("delete")
  async deleteUser(req: AuthenticatedRequest, res: Response) {
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin) {
      throw new AuthenticationError("No authorized");
    }
    const userId = req.body.userId;
    if (!userId) {
      throw new GeneralError("no user provider");
    }

    const success = this.userService.delete(userId);
    if (!success) {
      throw new GeneralError("Something went wrong");
    }

    return res
      .status(201)
      .json({ message: "user deleted successfully." })
      .send();
  }

  @Get("/users")
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = getRequestParams(req, "page", "number") as number;
      const pageSize =
        (getRequestParams(req, "pageSize", "number") as number) || 20;
      const offset = (page - 1) * pageSize;
      const [users, totalUserCount] = await this.userService.getAll(
        pageSize,
        offset,
      );

      return res
        .json({ users, count: totalUserCount, page })
        .status(200)
        .send();
    } catch (error) {
      throw new GeneralError("Something went wrong");
    }
  }
}
