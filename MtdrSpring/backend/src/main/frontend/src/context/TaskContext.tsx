import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { TaskStatus } from "../components/enums.tsx";

export interface Task {
  id: number;
  name: string;
  description: string;
  startDate: string;
  estimatedDate: string;
  endDate?: string;    //opcional
  storyPoints: number;
  status: TaskStatus;
  projectId: number;
  sprintId?: number;   //opcional
  responsibleId: number;
  userStoryId: number;
}


interface TasksContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, "id"> & { sprintId?: number }) => Promise<void>;
  updateTaskState: (taskId: number, newState: TaskStatus) => void;
  refreshTasks: () => Promise<void>;
}

// Mapeo para enviar al backend
const estadoMapBackend = {
  [TaskStatus.TODO]: 1,
  [TaskStatus.DOING]: 2,
  [TaskStatus.REVISION]: 3,
  [TaskStatus.DONE]: 4,
};

// Normaliza el estado del backend a TaskStatus
const normalizeStatus = (nombre: string): TaskStatus => {
  switch (nombre?.toLowerCase()) {
    case "todo":
    case "to do":
      return TaskStatus.TODO;
    case "doing":
    case "en progreso":
      return TaskStatus.DOING;
    case "revision":
    case "en revision":
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

  const fetchTareas = useCallback(async () => {
    try {
      const response = await axios.get("/tarea");
      const tareasBackend = response.data as any[];

      const estadoMapFrontend: Record<number, TaskStatus> = {
        1: TaskStatus.TODO,
        2: TaskStatus.DOING,
        3: TaskStatus.REVISION,
        4: TaskStatus.DONE,
      };

      const tareasMapeadas: Task[] = tareasBackend.map((tarea) => ({
        id: tarea.id,
        name: tarea.titulo,
        description: tarea.descripcion,
        startDate: tarea.fechaInicio,
        estimatedDate: tarea.fechaFinEstimada,
        endDate: tarea.fechaFinReal,
        storyPoints: tarea.prioridad,
        status: tarea.estadoTareaId
          ? estadoMapFrontend[tarea.estadoTareaId] || TaskStatus.TODO
          : TaskStatus.TODO,
        projectId: tarea.proyecto?.id || 0,
        sprintId: tarea.sprint?.id || null,
        responsibleId: tarea.desarrolladorId || 0,
        userStoryId: tarea.historiaUsuarioId || 0,

      }));

      setTasks(tareasMapeadas);
      console.log("Tareas cargadas:", tareasMapeadas);
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const addTask = useCallback(async (task: Omit<Task, "id"> & { sprintId?: number }) => {
    try {
      const dto = {
        titulo: task.name,
        descripcion: task.description,
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaFinEstimada: task.estimatedDate,
        fechaFinReal: null,
        prioridad: task.storyPoints,
        estadoTareaId: estadoMapBackend[task.status] || estadoMapBackend[TaskStatus.TODO],
        proyectoId: 1, // Puedes hacerlo dinámico si lo necesitas
        sprintId: task.sprintId || 1,
        desarrolladorId: task.responsibleId || 1,
        historiaUsuarioId: 1, // Puedes hacerlo dinámico si lo necesitas
      };

      console.log("Enviando DTO al backend:", dto);

      const response = await axios.post("/tarea", dto/*, { headers: { "Content-Type": "application/json" }}*/);
      const tareaCreada = response.data;

      const nuevaTask: Task = {
        id: tareaCreada.id,
        name: tareaCreada.titulo,
        description: tareaCreada.descripcion,
        startDate: tareaCreada.fechaInicio,
        estimatedDate: tareaCreada.fechaFinEstimada,
        endDate: tareaCreada.fechaFinReal,
        storyPoints: tareaCreada.prioridad,
        status: normalizeStatus(tareaCreada.estadoTarea?.nombreEstado), 
        projectId: tareaCreada.proyectoId || "Sin proyecto",
        sprintId: tareaCreada.sprintId || null,
        responsibleId: tareaCreada.desarrolladorId || 0,
        userStoryId: tareaCreada.historiaUsuarioId || 0,
      };

      setTasks((prev) => [...prev, nuevaTask]);
      console.log("Tarea creada:", nuevaTask);
    } catch (error) {
      console.error("Error al crear tarea:", error);
      throw new Error("Error al crear tarea. Ver consola para más detalles.");
    }
  }, []);

  // Actualizar solo el estado de la tarea
  const updateTaskState = useCallback(async (taskId: number, newState: TaskStatus) => {
    const estadoTareaId = estadoMapBackend[newState];

    try {
      const response = await axios.put(
        `/tarea/${taskId}/estado/${estadoTareaId}`
      );

      if (response.status === 200) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newState } : task
          )
        );
        console.log(`Estado de tarea ${taskId} actualizado a ${newState}`);
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw new Error("No se pudo actualizar el estado de la tarea.");
    }
  }, []);

  const refreshTasks = useCallback(async () => {
    await fetchTareas();
  }, [fetchTareas]);

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTaskState, refreshTasks }}>
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