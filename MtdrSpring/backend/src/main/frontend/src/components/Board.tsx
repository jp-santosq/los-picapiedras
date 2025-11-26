import { useState, useMemo } from "react";
import Canva from "./Canva.tsx";
import "../styles/components/board.css";
import { Task } from "../context/TaskContext.tsx";
import { ROL, TaskStatus } from "./enums.tsx";
import { useTasks } from "../context/TaskContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import TaskReadOnlyModal from './TaskReadOnlyModal.tsx';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Board() {
  const { tasks, updateTaskState } = useTasks();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const isAdmin = user?.rol === ROL.ADMINISTRADOR;
  console.log("User Role:", user?.rol);

  // Filtrar tareas del usuario actual
  const userTasks = useMemo(() => {
    if (!user) return [];
    if (isAdmin) return tasks;
    return tasks.filter(task => task.responsibleId === user.id);
  }, [tasks, user,isAdmin]);

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
      color: "#083D77"
    },
    { 
      status: TaskStatus.DOING, 
      title: "En Progreso", 
      color: "#EF2D56"
    },
    { 
      status: TaskStatus.REVISION, 
      title: "En Revisión", 
      color: "#DCED31"
    },
    { 
      status: TaskStatus.DONE, 
      title: "Completado", 
      color: "#28A745"
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
      <div className="board-container">
        <div className="board-columns">
          {columns.map((column) => {
            const columnTasks = userTasks.filter(t => t.status === column.status);
            return (
              <div key={column.status} className="board-column-wrapper">
                <div className="column-header" style={{ borderTopColor: column.color }}>
                  <div className="column-header-content">
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

      <hr className="board-separator" />

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
      
      <hr className="board-separator" />

      {/* Header del Board */}
      <div className="board-header">
        <div className="board-header-content">
          <h1 className="board-title">
            <span className="board-icon">
              <div className="board-icon-wrapper">
              <ListAltIcon fontSize="large"/>
              </div>
            </span>
            Tareas
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="board-stats">
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-total">
              <span className="stat-icon">
                <AssignmentIcon fontSize="large"/>
              </span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-progress">
              <span className="stat-icon">
                <OfflineBoltIcon fontSize="large"/>
              </span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">Activas</span>
            </div>
          </div>
          
          <div className="board-stat-card">
            <div className="stat-icon-wrapper stat-completed">
              <span className="stat-icon">
                <CheckCircleIcon fontSize="large"/>
              </span>
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