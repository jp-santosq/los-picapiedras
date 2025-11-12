import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { ROL } from 'components/enums';

interface User {
  id: number;
  name: string;
  email: string;
  rol: ROL;
}

interface UserContextType {
  users: User[];
  getUserById: (id: number) => User | undefined;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  // 🔹 Envolver fetchUsers con useCallback
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/usuario/usuarios");
      let usersBackend: any = response.data;
      
      if (typeof usersBackend === "string") {
        usersBackend = JSON.parse(usersBackend);
      }

      // 🔹 MAPEAR correctamente del backend al frontend
      const mappedUsers: User[] = usersBackend.map((user: any) => ({
        id: user.id,
        name: user.nombreUsuario,  // ✅ Mapear nombreUsuario -> name
        email: user.correo,         // ✅ Mapear correo -> email
        rol: user.rolId             // ✅ Mapear rolId -> rol
      }));

      setUsers(mappedUsers);
      console.log("Usuarios cargados:", mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []); // Sin dependencias

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🔹 Usar useMemo o simplemente buscar directamente
  const getUserById = useCallback((id: number): User | undefined => {
    const user = users.find(user => user.id === id);
    if (user) {
      console.log("Usuario encontrado:", user);
    }
    return user;
  }, [users]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider value={{ users, getUserById, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};