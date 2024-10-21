import { create } from 'zustand';

import { client } from '@/api';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

type User  = {
  id: string;
  email: string;
  activeStoreId: string | null;
}

interface AuthState {
  token: TokenType | null;
  user: User| null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => void;
  checkAuthStatus: () => Promise<void>;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  signIn: async (token) => {
    setToken(token);
    set({ status: 'loading', token });
    await get().checkAuthStatus();
  },
  signOut: () => {
    removeToken();
    set({ status: 'unauthenticated', token: null, user: null });
  },
  checkAuthStatus: async () => {
    set({ status: 'loading' });
    try {
      const token = getToken();
      if (!token) {
        get().signOut();
        return;
      }
      const response = await client.get< {
        type: string;
        message?: string;
        data?:User;
      }>('/auth/check');
      console.log('Env.API_URL',response.data)
      
      if (response.data?.type === 'error' || !response?.data?.data) {
        get().signOut();
        return;
      }

      set({ status: 'authenticated', user: response.data.data });
    } catch (error) {
      console.error('Error checking auth status:', error);
      get().signOut();
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const checkAuthStatus = () => _useAuth.getState().checkAuthStatus();
