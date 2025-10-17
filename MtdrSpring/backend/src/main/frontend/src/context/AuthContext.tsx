import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

export type User = { id: number; name: string; email: string; idRol: number } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const login = useCallback(async (mail: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", {
        email: mail,
        password: password
      });

      if (response.status === 200) {
        const userData = response.data;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          idRol: userData.idRol,
        });
        setShowWelcome(true);
        return true;
      } 
      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
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

  return <AuthContext.Provider value={value}>
    {children}
    <Snackbar
      open= {showWelcome}
      autoHideDuration= {4000}
      onClose = {()=> setShowWelcome(false)}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert
          onClose={() => setShowWelcome(false)}
          severity="success"
          sx={{ width: '100%'  }}
          >
            {`¡Bienvenido, ${user?.name}!`}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};