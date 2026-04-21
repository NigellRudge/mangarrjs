import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashText = async (text: string): Promise<string> => {
  if (!text) return Promise.resolve("");
  const generatedSale = bcrypt.genSaltSync(10);
  return await bcrypt.hash(text, generatedSale);
};

export const compareHashedText = async (text1: string, text2: string) => {
  return await bcrypt.compare(text1, text2);
};

export const getJwtToken = async (userId: number) => {
  const secret = process.env.JWT_SECRET || "";
  return jwt.sign({ userId, createdAt: Date.now() }, secret, {
    expiresIn: "5d",
  });
};

export const getRefreshToken = async (userId: number) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || "";
  return jwt.sign({ userId, createdAt: Date.now() }, secret, {
    expiresIn: "4d",
  });
};
