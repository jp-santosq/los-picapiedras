import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type User = { id: number; name: string; email: string; isAdmin: boolean } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = useCallback(async (mail: string, password: string) => {
    let tries = 0;
    while (tries < 3) {
      if (mail === "prueba@oracle.com" && password === "12345") {
        const fakeUser: User = { id: 3, name: "Ale Terán", email: mail, isAdmin: true };
        setUser(fakeUser);
        return true;
      } else {
        tries++;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};