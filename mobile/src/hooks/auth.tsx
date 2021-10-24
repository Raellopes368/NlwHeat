import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = '5a2db86d58dfa83ea2bf';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlw:user';
const TOKEN_STORAGE = '@nlw:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}
type AuthProvider = {
  children: React.ReactNode;
}


type AuthContextData = {
  user: User | null;
  isSignIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({ } as AuthContextData);

function AuthProvider({ children }: AuthProvider) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [user, setUser] = useState<User| null>(null);

  async function signIn() {
    setIsSignIn(true);
    try {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
      if(authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {
          const authResponse = await api.post('/authenticate', {
            code: authSessionResponse.params.code,
          });
          const { user, token } = authResponse.data as AuthResponse;
          api.defaults.headers.common.authorization = `Bearer ${token}`;
          await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
          await AsyncStorage.setItem(TOKEN_STORAGE, token);
          setUser(user);
      }
    }catch (error) {
      //
    } finally {
        setIsSignIn(false);
      }

    
  }

  async function signOut() {
    AsyncStorage.removeItem(USER_STORAGE);
    AsyncStorage.removeItem(TOKEN_STORAGE);
    setUser(null);
  }
  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);
      if(userStorage && tokenStorage) {
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }

      setIsSignIn(false);

    }
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      user,
      isSignIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export {
  AuthProvider,
  useAuth,
}