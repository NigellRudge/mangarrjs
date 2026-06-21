import { createContext, ReactNode, useEffect, useState } from "react";
import LoginPage from "@/components/pages/LoginPage";
import { authClient, isTokenValid } from "@/http/auth-client";

type AuthState = {
  isLoggedIn: boolean;
  user: Record<string, any> | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authError?: any | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isAuthLoading: false,
  login: async () => {},
  logout: async () => {},
  authError: null,
};
export const AuthContext = createContext<AuthState>(initialState);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const isLoggedIn = !isAuthLoading && Boolean(user);
  const [authError, setAuthError] = useState<any | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsAuthLoading(true);
      const response = await authClient.login({ email, password });
      if (!response) {
        throw new Error("Login failed.");
      }
      const { accessToken, user } = response;
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
    } catch (error: any) {
      console.error(error);
      setAuthError(error?.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthLoading(true);
      await authClient.logout();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAuthLoading(false);
      setUser(null);
      localStorage.removeItem("accessToken");
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authClient.refresh();
      if (!response) {
        throw new Error("Refresh Auth failed");
      }
      const { accessToken, user } = response;
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && isTokenValid(accessToken)) {
          await refreshAuth();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isAuthLoading)
    return <span className="loading loading-bars loading-xl"></span>;

  if (!isAuthLoading && !isLoggedIn) {
    return (
      <AuthContext.Provider
        value={{ login, logout, isLoggedIn, isAuthLoading, user }}
      >
        <div className="w-screen h-screen">
          <LoginPage />
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        login,
        logout,
        user,
        isLoggedIn,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
