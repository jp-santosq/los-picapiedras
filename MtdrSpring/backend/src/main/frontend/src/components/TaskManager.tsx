import React, { useState } from "react";
import "../styles/components/taskManager.css";
import { useTasks } from "../context/TaskContext.tsx";
import { TaskStatus } from "./enums.tsx";

export function TaskManager() {
  const { addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    responsible: "",
    responsibleId:0,
    estimatedDate: "",
    storyPoints: 0,
    description: "",
    project: "los-picapiedras #X",
    status: TaskStatus.TODO,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewTask((prev) => ({ 
      ...prev, 
      [name]: name === "storyPoints" ? parseInt(value) || 0 : value 
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTask(newTask);
    setIsModalOpen(false);
    setNewTask({
      name: "",
      responsible: "",
      responsibleId:0,
      estimatedDate: "",
      storyPoints: 0,
      description: "",
      project: "los-picapiedras #X",
      status: TaskStatus.TODO,
    });
  }

  return (
    <div className="task-manager">
      <div className="task-bar">
        <h2 className="project-title">Proyecto: Los Picapiedras</h2>
        <button className="create-task-btn" onClick={() => setIsModalOpen(true)}>
          + Crear Tarea
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Crear Nueva Tarea</h3>
            <form onSubmit={handleSubmit} className="task-form">
              <input type="text" name="name" placeholder="Nombre de la tarea" value={newTask.name} onChange={handleChange} required />
              <input type="text" name="responsible" placeholder="Responsable" value={newTask.responsible} onChange={handleChange} required />
              <input type="date" name="estimatedDate" value={newTask.estimatedDate} onChange={handleChange} required />
              <input type="number" name="storyPoints" placeholder="Story Points" value={newTask.storyPoints} onChange={handleChange} required min="0" />
              <textarea name="description" placeholder="Descripción" value={newTask.description} onChange={handleChange} />

              <div className="modal-actions">
                <button type="submit" className="save-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}