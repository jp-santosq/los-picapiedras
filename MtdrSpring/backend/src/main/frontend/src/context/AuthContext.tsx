// AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { ROL } from "../components/enums";

export type User = {
  id: number; 
  name: string; 
  email: string; 
  rol: ROL;
  image?: string;
  token?: string; // Guardamos el token también
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(false); // No más loading de verificación

  // No más verificación con backend, solo cargamos de localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Si el usuario tiene token, configuramos axios
        if (parsedUser.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user"); // Limpiamos datos corruptos
      }
    }
  }, []);

  const normalizeRol = (rolId: number): ROL => {
    switch(rolId) {
      case 1: return ROL.SUPERADMIN;
      case 2: return ROL.ADMINISTRADOR;
      case 3: return ROL.DESARROLLADOR;
      default: return ROL.DESARROLLADOR;
    }
  }

  const login = useCallback(async (correo: string, password: string) => {
    try {
      // Simplemente hacemos login y guardamos la respuesta
      const response = await axios.post("/auth/login", {
        correo: correo,
        password: password
      });

      if (response.status === 200) {
        const userData = response.data;
        const userObj = {
          id: userData.id,
          name: userData.nombreUsuario,
          email: userData.correo,
          rol: normalizeRol(userData.rol?.id || userData.rol),
          token: userData.token
        };
        
        setUser(userObj);
        // Guardamos TODO el objeto en localStorage
        localStorage.setItem("user", JSON.stringify(userObj));
        
        // Configuramos axios con el token si existe
        if (userData.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
        }
        
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
    // Limpiamos todo de localStorage
    localStorage.removeItem("user");
    // Limpiamos el header de axios
    delete axios.defaults.headers.common["Authorization"];
    // Limpiamos el estado
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading: false // Siempre false ya que no hacemos verificaciones
    }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Snackbar
        open={showWelcome}
        autoHideDuration={4000}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <Alert
          onClose={() => setShowWelcome(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {user ? `¡Bienvenido, ${user.name}!` : "¡Bienvenido!"}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};