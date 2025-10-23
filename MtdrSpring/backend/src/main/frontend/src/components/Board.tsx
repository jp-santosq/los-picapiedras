import React, { useState, useMemo } from "react";
import Canva from "./Canva.tsx";
import "../styles/components/board.css";
import { Task } from "../context/TaskContext.tsx";
import { TaskStatus } from "./enums.tsx";
import { useTasks } from "../context/TaskContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import TaskReadOnlyModal from './TaskReadOnlyModal.tsx';

function Board() {
  const { tasks, updateTaskState } = useTasks();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const isAdmin = user?.rol === 2;
  console.log("User Role:", user?.rol);

  // Filtrar tareas del usuario actual
  const userTasks = useMemo(() => {
    if (!user) return [];
    if (isAdmin) return tasks;
    return tasks.filter(task => task.responsibleId === user.id);
  }, [tasks, user]);

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const columns = [
    { 
      status: TaskStatus.TODO, 
      title: "Por Hacer", 
      icon: "📝",
      color: "#ffc107"
    },
    { 
      status: TaskStatus.DOING, 
      title: "En Progreso", 
      icon: "⚙️",
      color: "#007bff"
    },
    { 
      status: TaskStatus.REVISION, 
      title: "En Revisión", 
      icon: "👀",
      color: "#17a2b8"
    },
    { 
      status: TaskStatus.DONE, 
      title: "Completado", 
      icon: "✅",
      color: "#28a745"
    },
  ];

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(t => t.status === TaskStatus.DONE).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      progress: progress,
      inProgress: userTasks.filter(t => t.status === TaskStatus.DOING).length
    };
  }, [userTasks]);

  if (!user) {
    return (
      <div className="board-container">
        <div className="board-empty">
          <div className="empty-icon">🔒</div>
          <h2>Debes iniciar sesión</h2>
          <p>Por favor, inicia sesión para ver tu tablero Kanban</p>
        </div>
      </div>
    );
  }

  return (
    <div className="board-wrapper">
      {/* Kanban Board */}
      <div className="board-container">
        <div className="board-columns">
          {columns.map((column) => {
            const columnTasks = userTasks.filter(t => t.status === column.status);
            return (
              <div key={column.status} className="board-column-wrapper">
                <div className="column-header" style={{ borderTopColor: column.color }}>
                  <div className="column-header-content">
                    <span className="column-icon">{column.icon}</span>
                    <h3 className="column-title">{column.title}</h3>
                  </div>
                  <span className="column-count" style={{ backgroundColor: column.color }}>
                    {columnTasks.length}
                  </span>
                </div>
                <Canva
                  state={column.status}
                  tasks={columnTasks}
                  updateTaskState={updateTaskState}
                  onTaskClick={handleTaskClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="board-progress-section">
        <div className="progress-label">
          <span>Progreso General</span>
          <span className="progress-percentage">{stats.progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      {/* Header del Board */}
      <div className="board-header">
        <div className="board-header-content">
          <h1 className="board-title">
            <span className="board-icon">📊</span>
            Tareas
          </h1>
        </div>
        
        {/* Stats Cards */}
        <div className="board-stats">
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-total">
              <span className="stat-icon">📋</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-progress">
              <span className="stat-icon">⚡</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">Activas</span>
            </div>
          </div>
          
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-completed">
              <span className="stat-icon">✓</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.progress}%</span>
              <span className="stat-label">Completado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Tarea (Solo Lectura) */}
      <TaskReadOnlyModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTask}
      />
    </div>
  );
}

export default Board;