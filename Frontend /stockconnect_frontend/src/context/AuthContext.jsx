import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY  = 'sc_access_token';
const ROLE_KEY   = 'sc_role';
const USER_KEY   = 'sc_user_id';

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [role, setRole]     = useState(() => localStorage.getItem(ROLE_KEY));
  const [userId, setUserId] = useState(() => localStorage.getItem(USER_KEY));

  const saveSession = useCallback(({ accessToken, role, userId }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_KEY, userId);
    setToken(accessToken);
    setRole(role);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setRole(null);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, userId, saveSession, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
