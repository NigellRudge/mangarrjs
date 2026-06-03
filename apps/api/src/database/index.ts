import { DataSource } from "typeorm";
import User from "@database/entities/user";
import RefreshToken from "@database/entities/refresh-token";
import {
  createClient,
  RedisClientType,
  SocketTimeoutError,
  ConnectionTimeoutError,
} from "redis";
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

  try {
    databaseInstance = await databaseInstance.initialize();
  } catch (error) {
    console.log(error);
  }
}

export async function initRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      reconnectStrategy: (retries, cause: any) => {
        const limit = parseInt(process.env.REDIS_RETRY_LIMIT || "1");
        if (retries > limit) {
          console.log("redis retry limit exceeded");
          return false;
        }
        if (
          ["ECONNREFUSED", "ENOTFOUND", "EHOSTUNREACH"].includes(cause?.code)
        ) {
          console.log("❌ Fatal Redis connection error");
          return false;
        }

        const jitter = Math.floor(Math.random() * 200);
        const delay = Math.min(Math.pow(2, retries) * 50, 2000);
        return delay + jitter;
      },
    },
  });

  try {
    redisClient.on("error", (error) => {
      console.error("Redis error:", error);
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
