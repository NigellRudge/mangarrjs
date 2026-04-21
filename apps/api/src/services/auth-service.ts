import { getJwtToken, getRefreshToken, hashText } from "@utils/crypto";
import UserService from "./user-service";
import NotFoundError from "@errors/not-found-error";
import AuthenticationError from "@errors/authentication-errors";
import { Repository } from "typeorm";
import RefreshToken from "@database/entities/refresh-token";
import { addDays } from "date-fns";
import Injectable from "@decorators/injectable";
import DatabaseService from "@services/database-service";

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}

  private get tokenRepository(): Repository<RefreshToken> {
    return this.databaseService.getRepository(
      RefreshToken,
    ) as Repository<RefreshToken>;
  }

  createNewUser = async (config: {
    username?: string;
    email: string;
    password: string;
  }) => {
    const username = Boolean(config.username) ? config.username : config.email;
    const password = await hashText(config.password);
    const success = await this.userService.create({
      username: username!,
      password,
      email: config.email,
    });
    return Boolean(success);
  };

  resetUserPassword = async (
    userId: number,
    data: { newPassword: string; oldPassword: string },
  ) => {
    const user = await this.userService.get(userId);

    if (!user) {
      throw new NotFoundError("User does not exist");
    }
    const newPassword = await hashText(data.newPassword);
    const oldPassword = await hashText(data.oldPassword);
    if (user.password !== oldPassword) {
      throw new AuthenticationError("incorrect old password");
    }
    user.password = newPassword;
    return await this.userService.save(user);
  };

  loginUser = async (username: string, email: string, password: string) => {
    const user = await this.userService.getByEmailAndPassword(
      username,
      email,
      password,
    );
    if (!user) {
      throw new NotFoundError("user does not exist");
    }
    const refreshToken = await getRefreshToken(user.id);
    const accessToken = await getJwtToken(user.id);

    await this.databaseService.database.transaction(async (manager) => {
      const transactionRepo = manager.getRepository(RefreshToken);

      await transactionRepo.update({ user: user }, { revoked: true });

      const newToken = transactionRepo.create({
        token: refreshToken,
        user,
        expiresAt: addDays(Date.now(), 4),
      });

      await transactionRepo.save(newToken);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: "", // TODO: Add the ability to upload user images
      },
    };
  };

  getNewRefreshToken = async (token: any) => {
    const refreshToken = await this.tokenRepository.findOne({
      where: { token: token },
      relations: ["user"],
    });

    if (!refreshToken || token.revoked) {
      throw new Error("Invalid token");
    }

    if (refreshToken.expiresAt < new Date()) {
      throw new Error("Expired token");
    }

    const accessToken = await getJwtToken(refreshToken.user.id);
    const newRefreshToken = await getRefreshToken(refreshToken.user.id);

    await this.databaseService.database.transaction(async (manager) => {
      const transactionRepo = manager.getRepository(RefreshToken);

      await transactionRepo.update({ token: token }, { revoked: true });

      const newToken = transactionRepo.create({
        token: newRefreshToken,
        user: refreshToken.user,
        expiresAt: addDays(
          Date.now(),
          parseInt(process.env.REFRESH_TOKEN_SECRET_LIFE_TIME || "1"),
        ),
      });

      await transactionRepo.save(newToken);
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: refreshToken.user,
    };
  };
}
