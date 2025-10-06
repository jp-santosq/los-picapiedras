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
  addTask: (task: Omit<Task, "id">) => Promise<void>;
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
        console.log("Tareas cargadas:", tareasMapeadas);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchTareas();
  }, []);

  // 🔹 Nuevo método que guarda en backend
  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const dto = {
        titulo: task.name,
        descripcion: task.description,
        fechaInicio: new Date().toISOString().split("T")[0], // hoy
        fechaFinEstimada: task.estimatedDate,
        fechaFinReal: null,
        prioridad: task.storyPoints,
        estadoTareaId: 1,
        proyectoId: 1,
        sprintId: 1,
        desarrolladorId: task.responsibleId || 1,
        historiaUsuarioId: 1,
      };

      const response = await axios.post("http://localhost:8080/tarea", dto);

      const tareaCreada = response.data;

      const nuevaTask: Task = {
        id: tareaCreada.id,
        name: tareaCreada.titulo,
        description: tareaCreada.descripcion,
        responsible: tareaCreada.desarrollador?.nombreUsuario || "Sin asignar",
        responsibleId: tareaCreada.desarrollador?.id || 0,
        estimatedDate: tareaCreada.fechaFinEstimada,
        storyPoints: tareaCreada.prioridad,
        project: tareaCreada.proyecto?.nombreProyecto || "Sin proyecto",
        status: normalizarEstado(tareaCreada.estadoTarea?.nombreEstado || "TODO"),
      };

      setTasks((prev) => [...prev, nuevaTask]);
      console.log("Tarea creada:", nuevaTask);
    } catch (error) {
      console.error("Error al crear tarea:", error);
      alert("Error al crear tarea. Ver consola para más detalles.");
    }
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
