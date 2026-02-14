import { AuthState, Business, User } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  selectBusiness: (business: Business) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    currentBusiness: null,
  });

  const login = (user: User) => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user,
    }));
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      currentBusiness: null,
    });
  };

  const selectBusiness = (business: Business) => {
    setAuthState((prev) => ({
      ...prev,
      currentBusiness: business,
    }));
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, selectBusiness }}
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
