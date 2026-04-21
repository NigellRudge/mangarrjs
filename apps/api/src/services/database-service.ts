import { DataSource } from "typeorm";
import { databaseInstance } from "@api/database";
import Injectable from "@decorators/injectable";

@Injectable()
export default class DatabaseService {
  constructor() {}

  public get database(): DataSource {
    if (!databaseInstance) {
      throw new Error("Database not initialized");
    }
    return databaseInstance;
  }

  public getRepository(T: any) {
    return this.database.getRepository(T);
  }
}
