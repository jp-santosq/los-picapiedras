import React, { useState } from "react";
import "../styles/components/taskManager.css";
import { useTasks } from "../context/TaskContext.tsx";
import { useAuth } from "../context/AuthContext.tsx"; // 👈 importa el contexto de autenticación
import { TaskStatus } from "./enums.tsx";

export function TaskManager() {
  const { addTask } = useTasks();
  const { user } = useAuth(); // 👈 obtenemos el usuario autenticado
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    estimatedDate: "",
    storyPoints: 0,
    project: "Los Picapiedras #X",
    status: TaskStatus.TODO,
    sprintId: 1,
    projectId: 1,
    userStoryId: 1,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: name === "storyPoints" || name === "sprintId" || name === "projectId" || name === "userStoryId"
        ? parseInt(value) || 0 
        : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión antes de crear una tarea.");
      return;
    }

    try {
      await addTask({
        name: newTask.name,
        description: newTask.description,
        startDate: new Date().toISOString().split("T")[0],
        estimatedDate: newTask.estimatedDate,
        storyPoints: newTask.storyPoints,
        status: newTask.status,
        projectId: newTask.projectId,
        sprintId: newTask.sprintId,
        responsibleId: user.id,
        userStoryId: newTask.userStoryId,
      });

      setIsModalOpen(false);
      setNewTask({
        ...newTask,
        sprintId: newTask.sprintId,
        projectId: newTask.projectId,
        userStoryId: newTask.userStoryId,
      });
    } catch (error) {
      alert("Error al crear la tarea. Por favor intenta de nuevo.");
      console.error(error);
    }
  }

  return (
    <div className="task-manager">
      <div className="task-bar">
        <h2 className="project-title">Proyecto: Los Picapiedras</h2>
        <h2 className="kanban-title">TABLERO KANBAN</h2>
        <button className="create-task-btn" onClick={() => setIsModalOpen(true)}>
          + Crear Tarea
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Crear Nueva Tarea</h3>
            <form onSubmit={handleSubmit} className="task-form">
              <input
                type="text"
                name="name"
                placeholder="Nombre de la tarea"
                value={newTask.name}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="estimatedDate"
                value={newTask.estimatedDate}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="storyPoints"
                placeholder="Story Points"
                value={newTask.storyPoints}
                onChange={handleChange}
                required
                min="0"
              />

              <input
                type="number"
                name="projectId"
                placeholder="ID del Proyecto"
                value={newTask.projectId}
                onChange={handleChange}
                required
                min="1"
              />

              <input
                type="number"
                name="sprintId"
                placeholder="ID del Sprint"
                value={newTask.sprintId}
                onChange={handleChange}
                required
                min="1"
              />

              <input
                type="number"
                name="userStoryId"
                placeholder="ID de Historia de Usuario"
                value={newTask.userStoryId}
                onChange={handleChange}
                required
                min="1"
              />

              <textarea
                name="description"
                placeholder="Descripción"
                value={newTask.description}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Guardar</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
