import React from 'react';
import { Task } from './TaskDescription';
import { TaskStatus } from './enums.tsx';
import '../styles/components/modal.css';

interface TaskReadOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskReadOnlyModal: React.FC<TaskReadOnlyModalProps> = ({
  isOpen,
  onClose,
  task
}) => {
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
                <span className="detail-value">{task.project}</span>
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
                <span className="detail-value">{task.responsible}</span>
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

          {/* Estado Actual */}
          <div className="details-section">
            <h3 className="section-title">📊 Estado Actual</h3>
            <div className="status-display">
              <span 
                className="status-display-badge"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                {task.status}
              </span>
              <p className="status-description">
                {task.status === TaskStatus.TODO && 'Esta tarea está pendiente de iniciar'}
                {task.status === TaskStatus.DOING && 'Esta tarea está en progreso'}
                {task.status === TaskStatus.REVISION && 'Esta tarea está en revisión'}
                {task.status === TaskStatus.DONE && 'Esta tarea ha sido completada'}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskReadOnlyModal;