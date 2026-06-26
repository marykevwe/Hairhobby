import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';
import { getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) { setLoading(false); return; }
      try {
        const { user } = await authApi.getMe();
        setCurrentUser(user);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    try {
      const { token, user } = await authApi.login(email, password);
      setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function signup(payload) {
    try {
      const { token, user } = await authApi.signup(payload);
      setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
