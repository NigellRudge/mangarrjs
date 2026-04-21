import { Request, Response } from "express";
import AuthenticationService from "@services/auth-service";
import GeneralError from "@errors/general-error";
import NotFoundError from "@errors/not-found-error";
import AuthenticationError from "@errors/authentication-errors";
import Injectable from "@decorators/injectable";
import Controller from "@decorators/controller";
import { Post, Put } from "@decorators/request-methods";

@Injectable()
@Controller("/auth")
export default class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("/login")
  async login(req: Request, res: Response) {
    const { email, password, username } = req.body;
    if (!email || !password) {
      throw new GeneralError("no email or password provided");
    }
    const { refreshToken, accessToken, user } =
      await this.authenticationService.loginUser(username, email, password);

    if (!refreshToken || !accessToken) {
      throw new AuthenticationError("incorrect credentials");
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({ accessToken, user }).status(200).send();
  }

  @Post("/sign-up")
  async signUp(req: Request, res: Response) {
    const { email, username, password, isSignUpPage } = req.body;
    if (!email || !password) {
      throw new AuthenticationError("Incorrect credentials");
    }
    const success = await this.authenticationService.createNewUser({
      email,
      password,
      username,
    });
    if (success) {
      return res.status(201).json({ message: "resource created" }).send();
    }
    throw new GeneralError("something went wrong");
  }

  @Put("/reset-password/:id")
  async resetPassword(req: Request, res: Response) {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId) {
      throw new NotFoundError("Not found");
    }

    const success = await this.authenticationService.resetUserPassword(
      parseInt(userId),
      {
        oldPassword,
        newPassword,
      },
    );

    if (!success) {
      throw new GeneralError("password change failed");
    }
    return res.status(201).json({ message: "password change" }).send();
  }

  @Post("/refresh")
  async refreshToken(req: Request, res: Response) {
    const { refreshToken: currentRefreshToken } = req.cookies;
    if (!currentRefreshToken) {
      throw new AuthenticationError("No valid refreshToken");
    }
    const { accessToken, refreshToken, user } =
      await this.authenticationService.getNewRefreshToken(currentRefreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.send({ status: "ok", accessToken, user });
  }

  @Post("/logout")
  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "logged out" }).send();
  }
}
