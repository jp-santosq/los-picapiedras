import React, { useState } from 'react';
import { Sprint } from '../../context/SprintContext.tsx';
import { Task } from '../../context/TaskContext.tsx';
import { useTasks } from '../../context/TaskContext.tsx';
import TaskReadOnlyModal from '../TaskReadOnlyModal.tsx';
import '../../styles/components/modal.css';
import { TaskStatus } from "../enums.tsx";

interface SprintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: Sprint | null;
}

const SprintDetailsModal: React.FC<SprintDetailsModalProps> = ({
  isOpen,
  onClose,
  sprint
}) => {
  const { tasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  if (!isOpen || !sprint) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Determinar el estado del sprint basado en las fechas
  const getSprintStatus = () => {
    const now = new Date();
    const startDate = new Date(sprint.fechaInicio);
    const endDate = new Date(sprint.fechaFinEstimada);
    
    if (sprint.fechaFinReal) {
      return 'Completado';
    } else if (now < startDate) {
      return 'Planificado';
    } else if (now >= startDate && now <= endDate) {
      return 'En Progreso';
    } else {
      return 'Retrasado';
    }
  };

  const sprintStatus = getSprintStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planificado': return { bg: '#fff3cd', color: '#856404' };
      case 'En Progreso': return { bg: '#cce5ff', color: '#004085' };
      case 'Completado': return { bg: '#d4edda', color: '#155724' };
      case 'Retrasado': return { bg: '#f8d7da', color: '#721c24' };
      default: return { bg: '#f8f9fa', color: '#495057' };
    }
  };

  // Filtrar tareas que pertenecen a este sprint
  const sprintTasks = sprint.tareas || [];

  // Nota: Necesitarías agregar sprintId al tipo Task para que esto funcione
  // Por ahora, mostramos todas las tareas como ejemplo

  const handleTaskClick = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const statusStyle = getStatusColor(sprintStatus);

  const taskStats = {
    total: sprintTasks.length,
    todo: sprintTasks.filter(t => t.status === TaskStatus.TODO).length,
    doing: sprintTasks.filter(t => t.status === TaskStatus.DOING).length,
    revision: sprintTasks.filter(t => t.status === TaskStatus.REVISION).length,
    done: sprintTasks.filter(t => t.status === TaskStatus.DONE).length,
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-group">
              <h2>Sprint #{sprint.id}</h2>
              <span 
                className="sprint-status"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                {sprintStatus}
              </span>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            {/* Información del Sprint */}
            <div className="details-section">
              <h3 className="section-title">📅 Información del Sprint</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Fecha de Inicio:</span>
                  <span className="detail-value">{formatDate(sprint.fechaInicio)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha de Fin:</span>
                  <span className="detail-value">{sprint?.fechaFinReal ? formatDate(sprint.fechaFinReal) : 'No ha terminado'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Objetivo:</span>
                  <span className="detail-value">{formatDate(sprint.fechaFinEstimada)}</span>
                </div>
              </div>
            </div>

            {/* Estadísticas de Tareas */}
            <div className="details-section">
              <h3 className="section-title">📊 Estadísticas de Tareas</h3>
              <div className="sprint-task-stats">
                <div className="stat-item">
                  <span className="stat-number">{taskStats.total}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item stat-todo">
                  <span className="stat-number">{taskStats.todo}</span>
                  <span className="stat-label">TODO</span>
                </div>
                <div className="stat-item stat-doing">
                  <span className="stat-number">{taskStats.doing}</span>
                  <span className="stat-label">DOING</span>
                </div>
                <div className="stat-item stat-revision">
                  <span className="stat-number">{taskStats.revision}</span>
                  <span className="stat-label">REVISION</span>
                </div>
                <div className="stat-item stat-done">
                  <span className="stat-number">{taskStats.done}</span>
                  <span className="stat-label">DONE</span>
                </div>
              </div>
            </div>

            {/* Lista de Tareas */}
            <div className="details-section">
              <h3 className="section-title">📋 Tareas del Sprint ({sprintTasks.length})</h3>
              {sprintTasks.length === 0 ? (
                <div className="empty-tasks">
                  <p>No hay tareas asignadas a este sprint</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {sprintTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="task-item"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div className="task-item-header">
                        <span className="task-item-id">#{task.id}</span>
                        <span className={`task-item-status status-${task.estadoTarea?.nombreEstado.toLowerCase().replace(" ", "-")}`}>
                          {task.estadoTarea?.nombreEstado || "Sin estado"}
                        </span>
                      </div>
                      <h4 className="task-item-title">{task.titulo}</h4>
                      <div className="task-item-footer">
                        <span className="task-item-responsible">
                          👤 {task.desarrollador?.nombreUsuario || "Sin responsable"}
                        </span>
                        <span className="task-item-points">
                          {task.prioridad ?? 0} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Tarea (Solo Lectura) */}
      <TaskReadOnlyModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTask}
      />
    </>
  );
};

export default SprintDetailsModal;