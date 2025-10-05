import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { Task } from "../components/TaskDescription.tsx";
import { TaskStatus } from "../components/enums.tsx";

interface TasksContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskState: (taskId: number, newState: TaskStatus) => void;
}

const normalizarEstado = (nombre: string) => {
  switch (nombre.toLowerCase()) {
    case "todo":
      return TaskStatus.TODO;
    case "doing":
    case "process":
    case "en progreso":
      return TaskStatus.DOING;
    case "en revision":
    case "revision":
      return TaskStatus.REVISION;
    case "done":
    case "terminado":
    case "completado":
      return TaskStatus.DONE;
    default:
      return TaskStatus.TODO;
  }
};

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/tarea");
        let tareasBackend: any = response.data;
        if (typeof tareasBackend === "string") {
          tareasBackend = JSON.parse(tareasBackend);
        }

        const tareasMapeadas: Task[] = tareasBackend.map((tarea: any) => ({
          id: tarea.id,
          name: tarea.titulo,
          description: tarea.descripcion,
          responsible: tarea.desarrollador?.nombreUsuario || "Sin asignar",
          responsibleId: tarea.desarrollador?.id || 0,
          estimatedDate: tarea.fechaFinEstimada,
          storyPoints: tarea.prioridad,
          project: tarea.proyecto?.nombreProyecto || "Sin proyecto",
          status: normalizarEstado(tarea.estadoTarea?.nombreEstado || "TODO"),
        }));

        setTasks(tareasMapeadas);
        console.log("Tareas mapeadas:", tareasMapeadas);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchTareas();
  }, []);

  const addTask = (task: Omit<Task, "id">) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTaskState = (taskId: number, newState: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newState } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTaskState }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks debe usarse dentro de un TasksProvider");
  }
  return context;
}
