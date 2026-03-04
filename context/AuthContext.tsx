import { AuthState, Business, User } from "@/types";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
export const AUTH_STATE_KEY = 'auth_state'
export async function SecureStoreSave(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  } 
  await SecureStore.setItemAsync(key, value);
}

export async function SecureStoreGet(key: string) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  let result = SecureStore.getItemAsync(key);
  return result;
}

interface AuthContextType extends AuthState {
  login: (user: User, token?: string, refreshToken? : string) => void;
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

  const saveAuthState = async () => {
    setTimeout(async () => {
      await SecureStoreSave(AUTH_STATE_KEY, JSON.stringify(authState));
    }, 500);
  };
  
  // Load auth state from secure storage on app start
  useEffect(() => {
    const loadAuthState = async () => {
      const storedState = await SecureStoreGet(AUTH_STATE_KEY);
      if (storedState) {
        setAuthState(JSON.parse(storedState));
      }
    };
    loadAuthState();
  }, []);

  // // Set auth state in secure storage whenever it changes
  // useEffect(() => {
  //   const saveAuthState = async () => {
  //     await SecureStoreSave(AUTH_STATE_KEY, JSON.stringify(authState));
  //   };
  //   saveAuthState();
  // }, [authState.token, authState.refreshToken, authState.isAuthenticated, authState.user, authState.currentBusiness]);

  const login = (user: User, token?:string, refreshToken?:string) => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user,
      token: token || prev.token,
      refreshToken: refreshToken || prev.refreshToken,
    }));
    saveAuthState();
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      currentBusiness: null,
      token: null,
      refreshToken: null,
    });
    saveAuthState();
  };

  const selectBusiness = (business: Business) => {
    setAuthState((prev) => ({
      ...prev,
      currentBusiness: business,
    }));
    saveAuthState();
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
