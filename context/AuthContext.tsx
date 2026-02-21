import { AuthState, Business, User } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  selectBusiness: (business: Business) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    currentBusiness: null,
    token: null,
    refreshToken: null,
  });

  const login = (user: User, token?:string, refreshToken?:string) => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user,
      token: token || prev.token,
      refreshToken: refreshToken || prev.refreshToken,
    }));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      currentBusiness: null,
      token: null,
      refreshToken: null,
    });
  };

  const selectBusiness = (business: Business) => {
    setAuthState((prev) => ({
      ...prev,
      currentBusiness: business,
    }));
  };

  const getToken = () => {
    return authState.token;
  }

  const getRefreshToken = () => {
    return authState.refreshToken;
  }

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, selectBusiness, getToken, getRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
