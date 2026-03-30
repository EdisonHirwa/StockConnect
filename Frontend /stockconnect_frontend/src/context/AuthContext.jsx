import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY   = 'sc_access_token';
const ROLE_KEY    = 'sc_role';
const USER_KEY    = 'sc_user_id';
const NAME_KEY    = 'sc_full_name';
const PHONE_KEY   = 'sc_phone';

export function AuthProvider({ children }) {
  const [token,       setToken]       = useState(() => localStorage.getItem(TOKEN_KEY));
  const [role,        setRole]        = useState(() => localStorage.getItem(ROLE_KEY));
  const [userId,      setUserId]      = useState(() => localStorage.getItem(USER_KEY));
  const [fullName,    setFullName]    = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [phoneNumber, setPhoneNumber] = useState(() => localStorage.getItem(PHONE_KEY) || '');

  const saveSession = useCallback(({ accessToken, role, userId, fullName = '', phoneNumber = '' }) => {
    localStorage.setItem(TOKEN_KEY,  accessToken);
    localStorage.setItem(ROLE_KEY,   role);
    localStorage.setItem(USER_KEY,   userId);
    localStorage.setItem(NAME_KEY,   fullName);
    localStorage.setItem(PHONE_KEY,  phoneNumber);
    setToken(accessToken);
    setRole(role);
    setUserId(userId);
    setFullName(fullName);
    setPhoneNumber(phoneNumber);
  }, []);

  const logout = useCallback(() => {
    [TOKEN_KEY, ROLE_KEY, USER_KEY, NAME_KEY, PHONE_KEY].forEach(k => localStorage.removeItem(k));
    setToken(null);
    setRole(null);
    setUserId(null);
    setFullName('');
    setPhoneNumber('');
  }, []);

  return (
    <AuthContext.Provider value={{
      token, role, userId, fullName, phoneNumber,
      saveSession, logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
