import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export interface Sprint {
  id: number;
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaFinReal?: string;
  proyecto: {
    id: number;
    nombreProyecto?: string;
  };
  tareas?: any[];
}

export interface CreateSprintDTO {
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaFinReal?: string;
  proyectoId: number;
}

interface SprintsContextProps {
  sprints: Sprint[];
  loading: boolean;
  error: string | null;
  addSprint: (sprint: CreateSprintDTO) => Promise<void>;
  updateSprint: (id: number, sprintData: Partial<Sprint>) => Promise<void>;
  deleteSprint: (id: number) => Promise<void>;
  completeSprint: (id: number) => Promise<void>;
  refreshSprints: () => Promise<void>;
}

const SprintsContext = createContext<SprintsContextProps | undefined>(undefined);

export function SprintsProvider({ children }: { children: ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/sprint/all");
      let sprintsBackend: any = response.data;
      
      if (typeof sprintsBackend === "string") {
        sprintsBackend = JSON.parse(sprintsBackend);
      }

      setSprints(sprintsBackend);
      console.log("Sprints cargados:", sprintsBackend);
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
      setError("Error al cargar los sprints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  const addSprint = async (sprintDTO: CreateSprintDTO) => {
    try {
      const response = await axios.post("/sprint/add", sprintDTO);
      await fetchSprints();
      console.log("Sprint creado:", response.data);
    } catch (error) {
      console.error("Error al crear sprint:", error);
      throw error;
    }
  };

  const updateSprint = async (id: number, sprintData: Partial<Sprint>) => {
    try {
      const response = await axios.put(
        `/sprint/update/${id}`,
        sprintData
      );
      await fetchSprints();
      console.log("Sprint actualizado:", response.data);
    } catch (error) {
      console.error("Error al actualizar sprint:", error);
      throw error;
    }
  };

  const deleteSprint = async (id: number) => {
    try {
      await axios.delete(`/sprint/${id}`);
      await fetchSprints();
      console.log("Sprint eliminado:", id);
    } catch (error) {
      console.error("Error al eliminar sprint:", error);
      throw error;
    }
  };

  const completeSprint = async (id: number) => {
    try {
      const response = await axios.put(`/sprint/${id}/complete`);
      await fetchSprints();
      console.log("Sprint completado:", response.data);
    } catch (error) {
      console.error("Error al completar sprint:", error);
      throw error;
    }
  };

  const refreshSprints = async () => {
    await fetchSprints();
  };

  return (
    <SprintsContext.Provider
      value={{
        sprints,
        loading,
        error,
        addSprint,
        updateSprint,
        deleteSprint,
        completeSprint,
        refreshSprints,
      }}
    >
      {children}
    </SprintsContext.Provider>
  );
}

export function useSprints() {
  const context = useContext(SprintsContext);
  if (!context) {
    throw new Error("useSprints debe usarse dentro de un SprintsProvider");
  }
  return context;
}
