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
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: name === "storyPoints" ? parseInt(value) || 0 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión antes de crear una tarea.");
      return;
    }

    await addTask({
      ...newTask,
      responsible: user.name,
      responsibleId: user.id,
    });

    setIsModalOpen(false);
    setNewTask({
      name: "",
      description: "",
      estimatedDate: "",
      storyPoints: 0,
      project: "Los Picapiedras #X",
      status: TaskStatus.TODO,
    });
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
