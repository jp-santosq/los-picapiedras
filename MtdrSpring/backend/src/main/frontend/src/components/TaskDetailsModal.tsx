import React, { useState } from 'react';
import { Task } from '../context/TaskContext.tsx';
import { useTasks } from '../context/TaskContext.tsx';
import { TaskStatus } from './enums.tsx';
import '../styles/components/modal.css';
import { User } from '../context/AuthContext.tsx';
import { useUsers } from '../context/UserContext.tsx';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task
}) => {
  const { updateTaskState } = useTasks();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getUserById } = useUsers();

  if (!isOpen || !task) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return { bg: '#fff3cd', color: '#856404' };
      case 'DOING': return { bg: '#cce5ff', color: '#004085' };
      case 'REVISION': return { bg: '#d1ecf1', color: '#0c5460' };
      case 'DONE': return { bg: '#d4edda', color: '#155724' };
      default: return { bg: '#f8f9fa', color: '#495057' };
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateTaskState(task.id, newStatus);
      console.log(`Tarea ${task.id} actualizada a ${newStatus}`);
      // El modal se actualiza automáticamente porque task viene del contexto
    } catch (err: any) {
      setError('Error al actualizar el estado de la tarea');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para obtener el nombre del responsable
    const getResponsibleName = (responsibleId: number | null | undefined): string => {
      if (!responsibleId) return 'Sin asignar';
      const responsible: User | undefined = getUserById(responsibleId);
      console.log("Responsable encontrado:", responsibleId, responsible?.name);
      return responsible?.name || 'Desconocido';
    };

  const statusStyle = getStatusColor(task.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>{task.name}</h2>
            <span 
              className="sprint-status"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            >
              {task.status}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* Cambiar Estado */}
          <div className="details-section">
            <h3 className="section-title">🔄 Cambiar Estado</h3>
            <div className="status-buttons">
              <button
                className={`status-btn status-btn-todo ${task.status === TaskStatus.TODO ? 'active' : ''}`}
                onClick={() => handleStatusChange(TaskStatus.TODO)}
                disabled={isUpdating || task.status === TaskStatus.TODO}
              >
                {isUpdating && task.status !== TaskStatus.TODO ? '⏳' : '📝'} TODO
              </button>
              <button
                className={`status-btn status-btn-doing ${task.status === TaskStatus.DOING ? 'active' : ''}`}
                onClick={() => handleStatusChange(TaskStatus.DOING)}
                disabled={isUpdating || task.status === TaskStatus.DOING}
              >
                {isUpdating && task.status !== TaskStatus.DOING ? '⏳' : '⚙️'} DOING
              </button>
              <button
                className={`status-btn status-btn-revision ${task.status === TaskStatus.REVISION ? 'active' : ''}`}
                onClick={() => handleStatusChange(TaskStatus.REVISION)}
                disabled={isUpdating || task.status === TaskStatus.REVISION}
              >
                {isUpdating && task.status !== TaskStatus.REVISION ? '⏳' : '👀'} REVISION
              </button>
              <button
                className={`status-btn status-btn-done ${task.status === TaskStatus.DONE ? 'active' : ''}`}
                onClick={() => handleStatusChange(TaskStatus.DONE)}
                disabled={isUpdating || task.status === TaskStatus.DONE}
              >
                {isUpdating && task.status !== TaskStatus.DONE ? '⏳' : '✅'} DONE
              </button>
            </div>
          </div>

          {/* Información General */}
          <div className="details-section">
            <h3 className="section-title">📋 Información General</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">ID de Tarea:</span>
                <span className="detail-value">#{task.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Proyecto:</span>
                <span className="detail-value">{task.projectId}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="details-section">
            <h3 className="section-title">📝 Descripción</h3>
            <p className="task-description-text">
              {task.description || 'Sin descripción'}
            </p>
          </div>

          {/* Asignación y Fechas */}
          <div className="details-section">
            <h3 className="section-title">👤 Asignación</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Responsable:</span>
                <span className="detail-value">{getResponsibleName(task.responsibleId)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha estimada:</span>
                <span className="detail-value">{formatDate(task.estimatedDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Story Points:</span>
                <span className="detail-value points-badge">{task.storyPoints}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;