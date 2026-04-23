import { Repository } from "typeorm";
import User from "@database/entities/user";
import { RecordStatus } from "@database/entities/shared/enums";
import { compareHashedText } from "@utils/crypto";
import {
  GeneralError,
  NotFoundError,
  AuthenticationError,
} from "@mangarr/shared/errors";
import Injectable from "@decorators/injectable";
import DatabaseService from "@services/database-service";

@Injectable()
export default class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  private get repository(): Repository<User> {
    return this.databaseService.getRepository(User) as Repository<User>;
  }

  save = async (user: User) => {
    if (!user) {
      throw new GeneralError("No object provided");
    }
    return Boolean(await this.repository.save(user));
  };

  create = async (data: {
    username: string;
    password: string;
    email: string;
  }): Promise<boolean> => {
    if (!Boolean(data)) {
      throw new GeneralError("no data provided");
    }
    const doesUserAlreadyExists =
      (await this.checkEmailAvailability(data.email)) ||
      (await this.checkUserNameAvailability(data.username));

    if (doesUserAlreadyExists) {
      throw new GeneralError("User already exists");
    }

    const user = new User();
    user.username = data.username;
    user.password = data.password;
    user.email = data.email;
    const newUser = await this.repository.save(user);
    return Boolean(newUser);
  };

  getUserInformationById = async (id: number) => {
    return await this.repository.findOne({
      where: {
        id: id,
        status: RecordStatus.active,
      },
      select: {
        username: true,
        id: true,
        role: true,
        status: true,
      },
    });
  };
  get = async (id: number): Promise<User | null> =>
    await this.repository.findOneBy({
      id,
    });

  getByEmailAndPassword = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const user = await this.repository.findOne({
      where: [{ email: email }, { username: username || email }],
    });
    if (!user) {
      throw new AuthenticationError("incorrect credentials");
    }
    const arePasswordsTheSame = await compareHashedText(
      password,
      user.password,
    );
    if (!arePasswordsTheSame) {
      throw new AuthenticationError("incorrect credentials");
    }
    return user;
  };

  delete = async (id: number): Promise<boolean> => {
    const user = await this.get(id);
    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }
    if (user.status === "archived") {
      return Boolean(this.repository.remove(user));
    }
    user.status = RecordStatus.archived;
    return Boolean(this.repository.save(user));
  };

  checkEmailAvailability = async (email: string): Promise<boolean> => {
    if (!email) return false;
    return await this.repository.exists({
      where: { email },
    });
  };

  checkUserNameAvailability = async (username: string): Promise<boolean> => {
    if (!username) return false;
    return await this.repository.exists({
      where: { username },
    });
  };

  getAll = async (pageSize: number = 10, offset: number = 0) => {
    return await this.repository.findAndCount({
      order: {
        username: "ASC",
      },
      skip: offset,
      take: pageSize,
    });
  };
}
