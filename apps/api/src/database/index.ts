import { DataSource } from "typeorm";
import User from "@database/entities/user";
import RefreshToken from "@database/entities/refresh-token";
import { createClient, RedisClientType } from "redis";
import { LRUCache } from "lru-cache";

export let databaseInstance: DataSource;
export let redisClient: RedisClientType;
export let imageCache: LRUCache<string, Buffer>;

export async function initDB() {
  databaseInstance = new DataSource({
    type: "sqlite",
    database: process.env.DB_FILE_NAME || "",
    entities: [User, RefreshToken],
    synchronize: true,
    logging: false,
  });

  console.log('reds',process.env.REDIS_URL)
  try {
    databaseInstance = await databaseInstance.initialize();
  } catch (error) {
    console.log(error);
  }
}

export async function initRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  try {
    redisClient.on("error", (error) => {
      console.log(error);
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("reconnecting", () => {
      console.log("🔄 Redis reconnecting...");
    });

    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
}

export const initImageCache = () => {
  try {
    imageCache = new LRUCache<string, Buffer>({
      max: 75,
      ttl: 1000 * 60 * 60 * 24 * 5,
    });
  } catch (error) {
    console.log(error);
  }
};
