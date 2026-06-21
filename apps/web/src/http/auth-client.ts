import "dotenv/config";
import { jwtDecode } from "jwt-decode";
import { BackendClient } from "@/http/backend-client";

export const isTokenValid = (token?: string) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000; // seconds
    return decoded.exp > now;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getAuthToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;
  return `Bearer ${accessToken}`;
};

class AuthClient extends BackendClient {
  constructor(headers: Record<string, string | number>) {
    super(headers, true);
  }

  login = async (data: { email: string; password: string }) => {
    const response = await this.client.post(`auth/login`, {
      email: data.email,
      password: data.password,
    });
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  logout = async () => {
    try {
      const response = await this.client.get(`auth/logout`, {});
      return response.status === 200;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  refresh = async () => {
    try {
      const response = await this.client.post(
        `auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export const authClient = new AuthClient({});
