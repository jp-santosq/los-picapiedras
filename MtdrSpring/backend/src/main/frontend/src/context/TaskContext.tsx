import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "../components/TaskDescription.tsx";
import { TaskStatus } from "../components/enums.tsx";

interface TasksContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, "id">) => void;
  updateTaskState: (taskId: number, newState: TaskStatus) => void;
}

const TasksContext = createContext<TasksContextProps | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "HU03: Login",
      status: TaskStatus.TODO,
      responsible: "Equipo Frontend",
      estimatedDate: "2025-09-20",
      storyPoints: 5,
      project: "los-picapiedras #13",
      description:
        "Implementar pantalla y lógica de autenticación para usuarios.",
    },
    {
      id: 2,
      name: "HU05: Creación de proyectos",
      status: TaskStatus.TODO,
      responsible: "Equipo Backend",
      estimatedDate: "2025-09-22",
      storyPoints: 8,
      project: "los-picapiedras #7",
      description:
        "Permitir la creación de nuevos proyectos dentro de la plataforma.",
    },
    {
      id: 3,
      name: "HU07: Creación de Sprint y asignación de tareas",
      status: TaskStatus.TODO,
      responsible: "Scrum Master",
      estimatedDate: "2025-09-25",
      storyPoints: 13,
      project: "los-picapiedras",
      description:
        "Funcionalidad para crear sprints y asignar tareas a los desarrolladores.",
    },
    {
      id: 4,
      name: "HU06: Gestión de tareas desarrollador",
      status: TaskStatus.TODO,
      responsible: "Equipo Fullstack",
      estimatedDate: "2025-09-23",
      storyPoints: 8,
      project: "los-picapiedras",
      description:
        "Permitir que los desarrolladores gestionen sus propias tareas (crear, actualizar, marcar completadas).",
    },
    {
      id: 5,
      name: "HU01: Visualización de KPIs Manager",
      status: TaskStatus.TODO,
      responsible: "Equipo Data",
      estimatedDate: "2025-09-28",
      storyPoints: 5,
      project: "los-picapiedras",
      description:
        "El manager podrá visualizar KPIs clave sobre el desempeño del equipo.",
    },
  ]);

  function addTask(task: Omit<Task, "id">) {
    setTasks((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((t) => t.id)) + 1, // Genera ID único
        ...task,
      },
    ]);
  }

  function updateTaskState(taskId: number, newState: TaskStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newState } : task
      )
    );
  }

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
